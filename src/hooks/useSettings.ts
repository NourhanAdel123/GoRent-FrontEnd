"use client";

import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { User } from "../types/user";
import { userService } from "../services/user";
import { setUser } from "../store/slices/authSlice";
import { ImageState, InfoState, PassState, InfoForm, PassForm, PassVisibility } from "../types/settings";

export function useSettings(user: User, onUpdate?: () => void) {
    const dispatch = useDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [imageState, setImageState] = useState<ImageState>({
        loading: false, error: null, success: false
    });

    const [infoState, setInfoState] = useState<InfoState>({
        open: false, loading: false, error: null, success: false
    });

    const [infoForm, setInfoForm] = useState<InfoForm>({
        name: user.name || "",
        phone: user.phone || "",
    });

    const [passState, setPassState] = useState<PassState>({
        open: false, loading: false, error: null, success: false
    });

    const [passForm, setPassForm] = useState<PassForm>({
        currentPassword: "", newPassword: "", confirmPassword: ""
    });

    const [passVisibility, setPassVisibility] = useState<PassVisibility>({
        current: false, new: false, confirm: false
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setImageState({ loading: true, error: null, success: false });
            const data = await userService.updateProfileImage(user._id, file);
            setImageState({ loading: false, error: null, success: true });
            if (data.user) dispatch(setUser(data.user));
            onUpdate?.();
        } catch (err: unknown) {
            setImageState({ loading: false, success: false, error: err instanceof Error ? err.message : "فشل تحديث الصورة" });
        }
    };

    const handleUpdateInfo = async () => {
        try {
            setInfoState(prev => ({ ...prev, loading: true, error: null, success: false }));
            const data = await userService.updateUser(user._id, infoForm);
            setInfoState(prev => ({ ...prev, loading: false, success: true }));
            if (data.user) dispatch(setUser(data.user));
            onUpdate?.();
            setTimeout(() => setInfoState(prev => ({ ...prev, open: false })), 1000);
        } catch (err: unknown) {
            setInfoState(prev => ({ ...prev, loading: false, error: err instanceof Error ? err.message : "فشل تحديث البيانات" }));
        }
    };

    const handleChangePassword = async () => {
        try {
            setPassState(prev => ({ ...prev, loading: true, error: null, success: false }));
            await userService.changePassword(user._id, passForm);
            setPassState(prev => ({ ...prev, loading: false, success: true }));
            setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            onUpdate?.();
            setTimeout(() => setPassState(prev => ({ ...prev, open: false })), 1000);
        } catch (err: unknown) {
            setPassState(prev => ({ ...prev, loading: false, error: err instanceof Error ? err.message : "فشل تغيير كلمة السر" }));
        }
    };

    const toggleVisibility = (field: keyof PassVisibility) => {
        setPassVisibility(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return {
        fileInputRef,
        imageState,
        infoState, setInfoState,
        infoForm, setInfoForm,
        passState, setPassState,
        passForm, setPassForm,
        passVisibility,
        toggleVisibility,
        handleImageUpload,
        handleUpdateInfo,
        handleChangePassword,
    };
}