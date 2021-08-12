interface Organisation {
    id: number;
    name: string;
}

interface Status {
    id: number;
    name: string;
    description: string;
}

export interface DupDtoInterface {
    id: number;
    org: Organisation;
    status: Status;
    initialContactDate: Date | string;
    setUpCompleted: Date | string;
    prereqsMet: Date | string;
    duaAgreedDate: Date | string;
    availabilityRequested: Date | string;
    availabilityConfirmed: Date | string;
    accessConfirmed: Date | string;
    createdOn: Date | string;
    lastEditedOn: Date | string;
}
