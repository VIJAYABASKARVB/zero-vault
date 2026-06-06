function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}


async function deriveKey(masterPassword, salt) {

  // 1. Convert masterPassword string to Uint8Array using TextEncoder
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(masterPassword);
  const saltBytes = encoder.encode(salt);

  // 2. Import the password bytes as a raw PBKDF2 key (importKey)
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    passwordBytes,
    {name:"PBKDF2"},
    false,
    ["deriveKey"]
  )

  // 3. Derive an AES-256-GCM key from it using PBKDF2 with salt + 210000 iterations (deriveKey)
  const deriveKey = await window.crypto.subtle.deriveKey(
    {
      name:"PBKDF2",
      salt:saltBytes,
      iterations:210000,
      hash:"SHA-256"
    },
    baseKey,
    {name: "AES-GCM",length:256},
    false,
    ["encrypt","decrypt"]
  )

  // 4. Return the derived CryptoKey
  return deriveKey;
}

function generateSalt() {
  // 1. Create a Uint8Array with 16 bytes
  const byteArray = new Uint8Array(16);

  // 2. Fill it with random bytes using window.crypto.getRandomValues
  window.crypto.getRandomValues(byteArray)

  // 3. Convert each byte to a 2-char hex string (pad with '0' if needed)
  let hex='';
  for (let i=0;i<byteArray.length;i++){
    hex += byteArray[i].toString(16).padStart(2,'0');
  }
  // 4. Join all hex strings together and return
  return hex;
}


async function encrypt(plaintext, key) {

  // 1. Generate 12 random bytes for the IV using getRandomValues
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // 2. Encode the plaintext string to Uint8Array using TextEncoder
  const encoded = new TextEncoder().encode(plaintext);

  // 3. Call window.crypto.subtle.encrypt with AES-GCM algorithm,
  //    the IV, the key, and the encoded plaintext
  const ciphertext = await window.crypto.subtle.encrypt(
    {name:"AES-GCM",iv},
    key,
    encoded
  )

  // 4. The result is an ArrayBuffer (ciphertext)
  // 5. Convert both ciphertext and IV to base64 using arrayBufferToBase64
  // 6. Return { ciphertext: base64string, iv: base64string }
  return{
    ciphertext:arrayBufferToBase64(ciphertext),
    iv:arrayBufferToBase64(iv.buffer)
  }

}

async function decrypt(ciphertext, iv, key) {

  // 1. Convert ciphertext and iv from base64 to ArrayBuffer using base64ToArrayBuffer
  const ciphertextBuffer = base64ToArrayBuffer(ciphertext);
  const ivBuffer = new Uint8Array(base64ToArrayBuffer(iv));

  // 2. Call window.crypto.subtle.decrypt with AES-GCM algorithm,
  //    the IV (as Uint8Array), the key, and the ciphertext ArrayBuffer
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBuffer },
    key,
    ciphertextBuffer
  );

  // 3. The result is an ArrayBuffer containing the decoded plaintext bytes
  // 4. Convert the ArrayBuffer back to a string using TextDecoder
  // 5. Return the plaintext string
  return new TextDecoder().decode(decrypted);
}


export { deriveKey, generateSalt, encrypt, decrypt };