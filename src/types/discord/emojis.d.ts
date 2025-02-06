export interface APIEmoji {
    id: string;
    name: string;
    animated: string;
    user: {
        username: string;
        id: string;
    }
}