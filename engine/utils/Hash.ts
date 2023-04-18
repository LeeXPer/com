class Hash {
	private _length: number;
	private _hash: Object;

	public constructor() {
		this.clear();
	}

	public clear(): void {
		this._hash = new Object();
		this._length = 0;
	}

	public put(key: string, value: Object, overrideValue: boolean = true): void {
		if (this.has(key) == false) {
			this._hash[key] = value;
			this._length++;
		}
		else if (overrideValue) {
			this._hash[key] = value;
		}
	}

	public remove(key: string): Object {
		var item: Object;
		if (this.has(key)) {
			item = this._hash[key];
			delete this._hash[key];
			this._length--;
			return item;
		}
		return null;
	}

	public has(key: string): boolean {
		if (key != null && this._hash[key] != null) {
			return true;
		}
		return false;
	}

	public take(key: string): Object {
		return this._hash[key];
	}

	public get isEmpty(): boolean {
		return this._length > 0 ? false : true;
	}

	public get length(): number {
		return this._length;
	}

	public get hash(): Object {
		return this._hash;
	}

	public dispose(): void {
		this._hash = null;
		this._length = 0;
	}

	public values(): Array<Object> {
		var array: Array<Object> = [];
		var key: string;
		for (key in this._hash) {
			array.push(this._hash[key]);
		}
		return array;
	}

	public copy(): Hash {
		var hash = new Hash;
		var key: string;
		for (key in this._hash) {
			hash.put(key, this._hash[key]);
		}
		return hash;
	}

}