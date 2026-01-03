import Qrcode from 'qrcode'

export const generateQr = async (otpAuthUrl : string)=>{
    return Qrcode.toDataURL(otpAuthUrl)
}