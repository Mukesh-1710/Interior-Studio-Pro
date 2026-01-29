export interface Item {
    id?: number;
    itemName: string;
    length: number;
    width: number;
    qty: number;
    unit: 'sq.ft' | 'no.';
    rate: number;
    amount: number;
}

export interface Room {
    id?: number;
    roomName: string;
    items: Item[];
    roomTotal: number;
}

export interface Project {
    id?: number;
    projectName: string;
    clientName: string;
    date: string;
    rooms: Room[];
    grandTotal: number;
}
