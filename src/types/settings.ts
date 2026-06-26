
export interface ImageState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

export interface InfoState {
    open: boolean;
    loading: boolean;
    error: string | null;
    success: boolean;
}

export interface PassState {
    open: boolean;
    loading: boolean;
    error: string | null;
    success: boolean;
}

export interface InfoForm {
    name: string;
    phone: string;
}

export interface PassForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface PassVisibility {
    current: boolean;
    new: boolean;
    confirm: boolean;
}