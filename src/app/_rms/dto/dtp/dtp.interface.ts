interface DtpOrgDtoInterface {
    id: number;
    name: string;
}

interface DtpStatusDtoInterface {
    id: number;
    name: string;
    description: string;
}


export interface DtpDtoInterface {
    id: number;
    orgId: DtpOrgDtoInterface;
    statusId: DtpStatusDtoInterface;
    initialContactDate: Date | string;
    setUpCompleted: Date | string;
    mdAccessGranted: Date | string;
    mdCompleteDate: Date | string;
    dtaAgreedDate: Date | string;
    uploadAccessRequested: Date | string;
    uploadAccessConfirmed: Date | string;
    uploadsComplete: Date | string;
    qcCheckCompleted: Date | string;
    mdIntegratedWithMdr: Date | string;
    availabilityRequested: Date | string;
    availabilityConfirmed: Date | string;
    createdOn: Date | string;
    lastEditedOn: Date | string;
}
