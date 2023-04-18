
interface IModule extends IProto{
    proxy:ModuleProxy;
    view:IModuleView;
    moduleName:string;
    register(moduleId:string);
    registerSub(...args:any[]):void;
    subHandler(message: IMessage):void;
    send(message: IMessage):void;
}