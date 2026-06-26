"use client";

import {
    Box, Typography, Divider, Alert, CircularProgress,
    Avatar, Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, InputAdornment, TextField, Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { User } from "../../../types/user";
import { useSettings } from "../../../hooks/useSettings";

interface SettingsTabProps {
    user: User;
    onUpdate?: () => void;
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <Box sx={{ mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main", mb: "8px" }}>
            {label}
        </Typography>
        <Typography variant="body1">{value || "—"}</Typography>
    </Box>
);

const SectionHeader = ({ title, action }: { title: string; action: React.ReactNode }) => (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
        <Box>{action}</Box>
    </Box>
);

const sectionSx = {
    p: 3, borderRadius: 3,
    boxShadow: "0px 2px 8px rgba(0,0,0,0.06)",
    border: "1px solid", borderColor: "divider",
};

export default function SettingsTab({ user, onUpdate }: SettingsTabProps) {
    const {
        fileInputRef, imageState,
        infoState, setInfoState, infoForm, setInfoForm,
        passState, setPassState, passForm, setPassForm,
        passVisibility, toggleVisibility,
        handleImageUpload, handleUpdateInfo, handleChangePassword,
    } = useSettings(user, onUpdate);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

            {/* Profile Image */}
            <Box sx={sectionSx}>
                <SectionHeader
                    title="الصورة الشخصية"
                    action={
                        <IconButton color="primary" onClick={() => fileInputRef.current?.click()} disabled={imageState.loading}
                            sx={{ border: "1px solid", borderColor: "primary.main", borderRadius: 2, px: 1.5, gap: 0.5 }}>
                            {imageState.loading ? <CircularProgress size={18} /> : <CameraAltIcon fontSize="small" />}
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.main" }}>تعديل الصورة</Typography>
                        </IconButton>
                    }
                />
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                        <Avatar src={user.profileImage} onClick={() => fileInputRef.current?.click()}
                            sx={{ width: 100, height: 100, bgcolor: "primary.main", fontSize: "2rem", cursor: "pointer" }}>
                            {user.name?.[0]?.toUpperCase()}
                        </Avatar>
                        <Box onClick={() => fileInputRef.current?.click()}
                            sx={{ position: "absolute", bottom: 0, right: 0, bgcolor: "primary.main", borderRadius: "50%", p: 0.5, cursor: "pointer", display: "flex" }}>
                            <CameraAltIcon sx={{ fontSize: 16, color: "#fff" }} />
                        </Box>
                    </Box>
                    <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImageUpload} />
                    {imageState.success && <Alert severity="success" sx={{ py: 0 }}>تم تحديث الصورة بنجاح</Alert>}
                    {imageState.error && <Alert severity="error" sx={{ py: 0 }}>{imageState.error}</Alert>}
                </Box>
            </Box>

            {/* Personal Info */}
            <Box sx={sectionSx}>
                <SectionHeader
                    title="البيانات الشخصية"
                    action={
                        <IconButton color="primary" onClick={() => setInfoState(prev => ({ ...prev, open: true }))}
                            sx={{ border: "1px solid", borderColor: "primary.main", borderRadius: 2, px: 1.5, gap: 0.5 }}>
                            <EditIcon fontSize="small" />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.main" }}>تعديل البيانات</Typography>
                        </IconButton>
                    }
                />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <InfoRow label="البريد الإلكتروني" value={user.email} />
                    <Divider />
                    <InfoRow label="الاسم" value={user.name} />
                    <Divider />
                    <InfoRow label="رقم الهاتف" value={user.phone || ""} />
                </Box>
            </Box>

            {/* Change Password */}
            <Box sx={sectionSx}>
                <SectionHeader
                    title="كلمة السر"
                    action={
                        <IconButton color="primary" onClick={() => setPassState(prev => ({ ...prev, open: true }))}
                            sx={{ border: "1px solid", borderColor: "primary.main", borderRadius: 2, px: 1.5, gap: 0.5 }}>
                            <LockOutlinedIcon fontSize="small" />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.main" }}>تغيير كلمة السر</Typography>
                        </IconButton>
                    }
                />
            </Box>

            {/* Edit Info Dialog */}
            <Dialog open={infoState.open} onClose={() => setInfoState(prev => ({ ...prev, open: false }))} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>تعديل البيانات الشخصية</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                        <TextField label="الاسم" value={infoForm.name}
                            onChange={(e) => setInfoForm(prev => ({ ...prev, name: e.target.value }))}
                            fullWidth size="small" />
                        <TextField label="رقم الهاتف" value={infoForm.phone}
                            onChange={(e) => setInfoForm(prev => ({ ...prev, phone: e.target.value }))}
                            fullWidth size="small" />
                        {infoState.success && <Alert severity="success">تم التحديث بنجاح</Alert>}
                        {infoState.error && <Alert severity="error">{infoState.error}</Alert>}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button onClick={() => setInfoState(prev => ({ ...prev, open: false }))} variant="outlined"
                        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}>إلغاء</Button>
                    <Button onClick={handleUpdateInfo} variant="contained" disabled={infoState.loading}
                        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, boxShadow: "none" }}>
                        {infoState.loading ? <CircularProgress size={20} color="inherit" /> : "حفظ"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Change Password Dialog */}
            <Dialog open={passState.open} onClose={() => setPassState(prev => ({ ...prev, open: false }))} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>تغيير كلمة السر</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                        {(["currentPassword", "newPassword", "confirmPassword"] as const).map((field, i) => (
                            <TextField
                                key={field}
                                label={["كلمة السر الحالية", "كلمة السر الجديدة", "تأكيد كلمة السر الجديدة"][i]}
                                type={passVisibility[field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm"] ? "text" : "password"}
                                value={passForm[field]}
                                onChange={(e) => setPassForm(prev => ({ ...prev, [field]: e.target.value }))}
                                fullWidth size="small"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <IconButton size="small" onClick={() => toggleVisibility(field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm")}>
                                                    {passVisibility[field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm"]
                                                        ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />
                        ))}
                        {passState.success && <Alert severity="success">تم تغيير كلمة السر بنجاح</Alert>}
                        {passState.error && <Alert severity="error">{passState.error}</Alert>}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button onClick={() => setPassState(prev => ({ ...prev, open: false }))} variant="outlined"
                        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}>إلغاء</Button>
                    <Button onClick={handleChangePassword} variant="contained" disabled={passState.loading}
                        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, boxShadow: "none" }}>
                        {passState.loading ? <CircularProgress size={20} color="inherit" /> : "تغيير"}
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}