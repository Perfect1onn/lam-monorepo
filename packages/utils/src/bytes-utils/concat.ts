function concatBytes(...arrays: Uint8Array[]): Uint8Array {
	let totalLength = 0;
	for (const arr of arrays) totalLength += arr.length;

	const result = new Uint8Array(totalLength);

	let offset = 0;
	for (const arr of arrays) {
		result.set(arr, offset);
		offset += arr.length;
	}

	return result;
}

function sliceBytes(bytes: Uint8Array, start: number, end?: number): Uint8Array {
	const len = bytes.length;

	start = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
	end = end === undefined ? len : end < 0 ? Math.max(len + end, 0) : Math.min(end, len);

	if (end <= start) return new Uint8Array();

	const result = new Uint8Array(end - start);
	for (let i = start; i < end; i++) {
		result[i - start] = bytes[i];
	}

	return result;
}

function equalBytes(a: Uint8Array, b: Uint8Array): boolean {
	if (a.length !== b.length) return false;

	let diff = 0;
	for (let i = 0; i < a.length; i++) {
		diff |= a[i] ^ b[i];
	}

	return diff === 0;
}

function isZeroBytes(bytes: Uint8Array): boolean {
	for (let i = 0; i < bytes.length; i++) {
		if (bytes[i] !== 0) return false;
	}

	return true;
}

export { concatBytes, sliceBytes, equalBytes, isZeroBytes };
