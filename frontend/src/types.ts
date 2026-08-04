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

export interface MaterialSpecification {
    id?: number;
    category?: string;
    itemName?: string;
    application?: string;
    brand?: string;
    modelSeries?: string;
    specification?: string;
    thickness?: string;
    finish?: string;
    quantity?: string;
    supplyResponsibility?: 'RR_INTERIORS_SUPPLIED' | 'CLIENT_SUPPLIED';
    remarks?: string;
    sortOrder?: number;
}

export interface PaymentMilestone {
    id?: number;
    milestoneName?: string;
    percentage?: number;
    amount?: number;
    status?: string;
    sortOrder?: number;
}

export interface QuotationTerm {
    id?: number;
    termText?: string;
    sortOrder?: number;
}

export interface Project {
    id?: number;
    quotationNumber?: string;
    date: string;
    validUntil?: string;

    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    clientAddress?: string;

    projectName?: string;
    projectLocation?: string;
    contractType?: string; // 'Material + Labour' | 'Labour Only' | 'Turnkey'
    estimatedDuration?: string;
    projectScope?: string; // JSON string array e.g. '["Modular Kitchen", "Wardrobes"]'

    rooms: Room[];

    materialSpecifications?: MaterialSpecification[];
    paymentMilestones?: PaymentMilestone[];
    quotationTerms?: QuotationTerm[];

    subTotal?: number;
    discount?: number;
    taxPercentage?: number;
    taxAmount?: number;
    grandTotal: number;
    amountInWords?: string;

    warrantyTerms?: string;
    clientSignName?: string;
    authorizedSignatory?: string;
}

