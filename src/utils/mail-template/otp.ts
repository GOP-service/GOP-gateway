import { OTPType } from "../enums";

export function OtpTemplate(username: string, otp: string, id: string, type: OTPType) {
    const now = new Date();
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Static Template</title>
    
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style="
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background: #ffffff;
          font-size: 14px;
        "
      >
        <div
          style="
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 30px 60px;
            background: #f4f7ff;
            background-image: url(https://gopstorage0.blob.core.windows.net/appicon/banner.png);
            background-repeat: no-repeat;
            background-size: 800px 320px;
            background-position: top center;
            font-size: 14px;
            color: #434343;
          "
        >
          <header>
            <table style="width: 100%">
              <tbody>
                <tr style="height: 0">
                  <td>
                    <img
                      alt=""
                      src="https://gopstorage0.blob.core.windows.net/appicon/419719854_852372740236971_578078780953487471_n.png"
                      height="60px"
                    />
                  </td>
                  <td style="text-align: right">
                    <span style="font-size: 16px; line-height: 30px; color: #ffffff"
                      >${now.toLocaleDateString()}</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </header>
    
          <main>
            <div
              style="
                margin: 0;
                margin-top: 20px;
                padding: 48px 30px 60px;
                background: #ffffff;
                border-radius: 30px;
                text-align: center;
              "
            >
              <div style="width: 100%; max-width: 489px; margin: 0 auto">
                <h1
                  style="
                    margin: 0;
                    font-size: 24px;
                    font-weight: 700;
                    color: #1f1f1f;
                  "
                >
                  Hey ${username},
                </h1>
                <p
                  style="
                    margin: 0;
                    margin-top: 16px;
                    font-weight: 500;
                    letter-spacing: 0.56px;
                  "
                >
                  Use the following OTP to complete the procedure to
                  <span style="font-weight: 600; color: #1f1f1f">${type}</span>
                  . OTP is valid for
                  <span style="font-weight: 600; color: #1f1f1f">30 minutes</span>.
                  Do not share this code with others, including GoP employees.
                </p>
                <p
                  style="
                    margin: 50px 0px 0px 50px;
                    font-size: 40px;
                    font-weight: 600;
                    letter-spacing: 50px;
                    color: #ba3d4f;
                  "
                >
                  ${otp}
                </p>
              </div>
            </div>
    
            <p
              style="
                max-width: 400px;
                margin: 0 auto;
                margin-top: 90px;
                text-align: center;
                font-weight: 500;
                color: #8c8c8c;
              "
            >
              Need help? Ask at
              <a
                href="mailto:phcnguyenba@gmail.com"
                style="color: #499fb6; text-decoration: none"
                >phcnguyenba@gmail.com</a
              >
              or visit our
              <a
                href="nbphuoc.id.vn"
                target="_blank"
                style="color: #499fb6; text-decoration: none"
                >Help Center</a
              >
            </p>
          </main>
    
          <footer
            style="
              width: 100%;
              max-width: 490px;
              margin: 20px auto 0;
              text-align: center;
              border-top: 1px solid #e6ebf1;
            "
          >
            <p
              style="
                margin: 0;
                margin-top: 40px;
                font-size: 16px;
                font-weight: 600;
                color: #434343;
              "
            >
              GoP Trasnport and Delivery
            </p>
            <p style="margin: 0; margin-top: 8px; color: #434343">
              1 Vo Van Ngan, Linh Chieu Ward, Thu Duc City, Ho Chi Minh City,
              Vietnam
            </p>
            <div style="margin: 0; margin-top: 16px">
              <a href="Facebook.com" target="_blank" style="display: inline-block">
                <img
                  width="36px"
                  alt="Facebook"
                  src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
                />
              </a>
              <a
                href="Instagram.com"
                target="_blank"
                style="display: inline-block; margin-left: 8px"
              >
                <img
                  width="36px"
                  alt="Instagram"
                  src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
              /></a>
              <a
                href="Youtube.com"
                target="_blank"
                style="display: inline-block; margin-left: 8px"
              >
                <img
                  width="36px"
                  alt="Youtube"
                  src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
              /></a>
            </div>
            <p style="margin: 0; margin-top: 16px; color: #434343">
              Copyright © 2024 Company. All rights reserved.
            </p>
          </footer>
        </div>
      </body>
    </html>    
    `
}