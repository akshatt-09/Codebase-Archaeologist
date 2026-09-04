import { formatUser } from './utils.js';

export interface UserProps {
    id: string;
    username: string;
}

export function renderUser(user: UserProps): string {
    if (!user || !user.username) {
        return "Unknown";
    }
    return formatUser(user.username);
}