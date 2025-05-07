export interface APIEmoji {
    id: string;
    name: string;
    animated: boolean;
    user: {
        username: string;
        id: string;
    }
}