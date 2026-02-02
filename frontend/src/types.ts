export interface Item {
    id?: number;
    itemName: string;
    length: number;
    width: number;
    pieces: number;
    totalArea: number;
    unit: 'sq.ft' | 'pcs';
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
    projectName?: string;
    clientName: string;
    clientPhone: string;
    date: string;
    rooms: Room[];
    grandTotal: number;
}
