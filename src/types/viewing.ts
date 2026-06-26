export interface ViewingRequestPayload {
  propertyId: string;
  scheduledAt: string;
  notes?: string;
}

export interface Viewing {
  _id: string;
  propertyId: string;
  tenantId: string;
  ownerId: string;
  scheduledAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';
  notes: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ViewingResponse {
  message: string;
  viewing: Viewing;
}
