class MemPool {
    private _cls: any;
    private _max: number = 0;
    private _freelist: Array<IMemPool>;
    public constructor(cls: any, maxNum: number = 16) {
        this._freelist = [];
        this._cls = cls;
        this._max = maxNum;
        var _inst = new this._cls();
        if (!(this.isImplementIMemPool(_inst))) {
            throw new Error("必须实现IMemPool接口");
        } else {
            this._freelist.push(_inst);
        }
    }
    public getObject(...args): IMemPool {
        var _obj: IMemPool = null;
        if (this._freelist.length == 0) {
            _obj = new this._cls(...args) as IMemPool;
            return _obj;
        }
        _obj = this._freelist.pop() as IMemPool;
        _obj.renew(...args);
        return _obj;
    }

    public returnObject(obj: IMemPool): void {
        if (obj instanceof this._cls) {
            if (this._freelist.length > this._max) {
                obj.dispose();
                return;
            }
            if (this._freelist.indexOf(obj) < 0) {
                obj.dispose();
                this._freelist.push(obj);
            }
        }
        else {
            new Error("只能回收注册的类");
        }
    }

    public dispose(): void {
        for (let obj of this._freelist) {
            obj.dispose();
        }
        this._freelist.length = 0;
    }
    private isImplementIMemPool(obj: IMemPool): obj is IMemPool {
        return (<IMemPool>obj).dispose !== undefined && (<IMemPool>obj).renew !== undefined;
    }
}
