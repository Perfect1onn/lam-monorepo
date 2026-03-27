function bytesToString(bytes: Uint8Array): string {
	const decoder = new TextDecoder();

	return decoder.decode(bytes);
}

function stringToBytes(data: string): Uint8Array {
	const encode = new TextEncoder();

	return encode.encode(data);
}

function bytesToHex(bytes: Uint8Array): string {
	let hex = '';
	for (let i = 0; i < bytes.length; i++) {
		hex += bytes[i].toString(16).padStart(2, '0');
	}
	return hex;
}

function hexToBytes(hex: string): Uint8Array {
	if (hex.startsWith('0x')) hex = hex.slice(2);

	if (hex.length % 2 !== 0) {
		throw new Error('Invalid hex string length');
	}

	const len = hex.length / 2;
	const bytes = new Uint8Array(len);

	for (let i = 0; i < len; i++) {
		const byte = hex.substr(i * 2, 2);
		const value = Number.parseInt(byte, 16);

		if (Number.isNaN(value)) {
			throw new Error(`Invalid hex byte: ${byte}`);
		}

		bytes[i] = value;
	}

	return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
	if (typeof bytes.toBase64 === 'function') {
		return bytes.toBase64();
	}

	let binary = '';
	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}

function base64ToBytes(str: string): Uint8Array {
	if (typeof Uint8Array.fromBase64 === 'function') {
		return Uint8Array.fromBase64(str);
	}

	const binary = atob(str);
	const bytes = new Uint8Array(binary.length);

	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}

	return bytes;
}

export { bytesToString, stringToBytes, bytesToHex, hexToBytes, bytesToBase64, base64ToBytes };
