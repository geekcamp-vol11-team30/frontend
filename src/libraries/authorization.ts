import { typeGuard } from "@/libraries/typeGuard";
import { generateUuid } from "@/libraries/uuid";
import { gcp_clientId, gcp_redirectUri, gcp_scopes } from "@/libraries/gcpEnv";
import {fetchUserInfo} from "@/libraries/userInfo";
import {requests} from "@/libraries/requests";

const loginBaseUri = "https://accounts.google.com/o/oauth2/v2/auth";
const getLoginUrl = (state: string) =>
	`${loginBaseUri}?client_id=${gcp_clientId}&scope=${gcp_scopes}&redirect_uri=${gcp_redirectUri}&state=${state}&prompt=consent&response_type=token&include_granted_scopes=true&enable_serial_consent=true&service=lso&o2v=2&flowName=GeneralOAuthFlow`;

const revokeBaseUri = "https://accounts.google.com/o/oauth2/revoke";
const getRevokeUrl = (token: string) =>
	`${revokeBaseUri}?token=${token}`;

const login = () => {
	const uuid = generateUuid();
	localStorage.setItem("gcp_state", uuid);
	location.href = getLoginUrl(uuid);
};

const reset = async() => {
	const token = localStorage.getItem("gcp_token");
	if (token){
		const req = await requests(getRevokeUrl(token));
		const res = await req.json();
		if (typeGuard.errorResponse(res)){
			if (res.error === "invalid_token") {
				console.warn("failed to revoke token")
			}
			console.warn(`Encountered unknown error\n${res.error}`)
		}
	}
	localStorage.removeItem("gcp_token");
	localStorage.removeItem("gcp_userInfo");
}

const parseToken = async() => {
	const data = location.hash
		.slice(1)
		.split("&")
		.reduce((pv, string) => {
			const [key, value] = string.split("=");
			pv[key] = decodeURI(value);
			return pv;
		}, {} as { [key: string]: string }) as unknown;
	if (
		!typeGuard.AuthorizationTokens(data) ||
		data.state !== localStorage.getItem("gcp_state")
	) {
		throw new Error("Invalid oauth response");
	}
	localStorage.setItem("gcp_token", data.access_token);
	localStorage.setItem("gcp_userInfo", JSON.stringify(await fetchUserInfo()));
};

export { login, reset, parseToken };
