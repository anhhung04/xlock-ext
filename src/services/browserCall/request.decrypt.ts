export default function requestDecrypt(
    text: string,
    type_creds: string,
    enc_pri?: string
  ): Promise<{
    plaintext: string;
  }> {
    return new Promise((resolve, reject) => {
      const id = "oggondagbjepnifnnmcgdipgbemcimea";
      chrome.runtime.sendMessage(
        id,
        {
          type: "REQUEST_DECRYPT",
          text,
          type_creds,
          ...(enc_pri && { enc_pri }),
        },
        (res: { success: boolean; plaintext: string }) => {
          if (res.success) {
            resolve({
              plaintext: res.plaintext,
            });
          } else {
            reject(new Error("There is some error"));
          }
        }
      );
    });
  }