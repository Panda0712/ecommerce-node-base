"use strict";

const htmlTemplateToken = () => {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <title>Xác thực OTP - Mã xác nhận</title>
    <style type="text/css">
        /* Reset styles */
        #outlook a { padding: 0; }
        body { 
            margin: 0; 
            padding: 0; 
            -webkit-text-size-adjust: 100%; 
            -ms-text-size-adjust: 100%; 
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        }
        table, td { 
            border-collapse: collapse; 
            mso-table-lspace: 0pt; 
            mso-table-rspace: 0pt; 
        }
        img { 
            border: 0; 
            height: auto; 
            line-height: 100%; 
            outline: none; 
            text-decoration: none; 
            -ms-interpolation-mode: bicubic; 
        }
        
        /* Main container */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        /* Header */
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
        }
        
        .header h1 {
            color: #ffffff;
            font-size: 28px;
            margin: 0;
            font-weight: bold;
        }
        
        .header p {
            color: #ffffff;
            font-size: 16px;
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        
        /* Content */
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        
        .content h2 {
            color: #333333;
            font-size: 24px;
            margin: 0 0 20px 0;
            font-weight: normal;
        }
        
        .content p {
            color: #666666;
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 20px 0;
        }
        
        /* OTP Code Box */
        .otp-container {
            background-color: #f8f9fa;
            border: 2px dashed #667eea;
            border-radius: 12px;
            padding: 30px 20px;
            margin: 30px 0;
            text-align: center;
        }
        
        .otp-label {
            color: #667eea;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }
        
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #333333;
            font-family: 'Courier New', monospace;
            letter-spacing: 8px;
            margin: 0;
            padding: 10px;
            background-color: #ffffff;
            border-radius: 8px;
            border: 1px solid #e9ecef;
            display: inline-block;
            min-width: 250px;
        }
        
        /* Warning box */
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }
        
        .warning-icon {
            color: #856404;
            font-size: 20px;
            margin-bottom: 10px;
        }
        
        .warning p {
            color: #856404;
            font-size: 14px;
            margin: 0;
            line-height: 1.5;
        }
        
        /* Footer */
        .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        
        .footer p {
            color: #999999;
            font-size: 14px;
            margin: 0 0 10px 0;
            line-height: 1.5;
        }
        
        .footer .company-name {
            color: #667eea;
            font-weight: bold;
        }
        
        /* Responsive */
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                margin: 0 !important;
                border-radius: 0 !important;
            }
            
            .header, .content, .footer {
                padding: 20px !important;
            }
            
            .header h1 {
                font-size: 24px !important;
            }
            
            .content h2 {
                font-size: 20px !important;
            }
            
            .otp-code {
                font-size: 28px !important;
                letter-spacing: 4px !important;
                min-width: 200px !important;
            }
        }
    </style>
</head>
<body>
    <div style="padding: 20px 0;">
        <div class="email-container">
            <!-- Header -->
            <div class="header">
                <h1>🔐 Xác Thực Tài Khoản</h1>
                <p>Mã xác nhận OTP của bạn</p>
            </div>
            
            <!-- Content -->
            <div class="content">
                <h2>Chào bạn!</h2>
                <p>Chúng tôi đã nhận được yêu cầu xác thực cho tài khoản của bạn. Vui lòng sử dụng mã OTP bên dưới để hoàn tất quá trình xác nhận:</p>
                
                <!-- OTP Code -->
                <div class="otp-container">
                    <div class="otp-label">Mã OTP của bạn</div>
                    <div class="otp-code">123456</div>
                </div>
                
                <p><strong>Mã này sẽ hết hạn sau 10 phút.</strong></p>
                <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào.</p>
                
                <!-- Warning -->
                <div class="warning">
                    <div class="warning-icon">⚠️</div>
                    <p><strong>Lưu ý bảo mật:</strong><br>
                    • Không chia sẻ mã OTP này với bất kỳ ai<br>
                    • Chúng tôi sẽ không bao giờ yêu cầu mã OTP qua điện thoại<br>
                    • Nếu nghi ngờ có hoạt động đáng ngờ, vui lòng liên hệ ngay</p>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <p>Email này được gửi từ <span class="company-name">[Tên Công Ty]</span></p>
                <p>Nếu bạn có thắc mắc, vui lòng liên hệ: support@company.com</p>
                <p style="margin-top: 20px; font-size: 12px;">
                    © 2024 [Tên Công Ty]. Tất cả các quyền được bảo lưu.<br>
                    [Địa chỉ công ty]
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};

module.exports = {
  htmlTemplateToken,
};
