export interface User {
    name: string;
    role: string;
}

export interface NavItem {
    label: string;
    icon: string;
    path: string;
    subItems?: NavItem[];
}
