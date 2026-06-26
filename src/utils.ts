export function parseHash(hashStr: string) {
  const hash = hashStr.replace(/^#/, "");
  const [path, queryStr] = hash.split("?");
  const query: Record<string, string> = {};
  if (queryStr) {
    queryStr.split("&").forEach((param) => {
      const [key, val] = param.split("=");
      if (key) {
        query[decodeURIComponent(key)] = decodeURIComponent(val || "");
      }
    });
  }
  return { path: path || "home", query };
}

export function formatPrice(amount: number): string {
  return `${amount.toFixed(2)} د.ل`;
}

export function compressImage(file: File, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => {
        reject(err);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
}
