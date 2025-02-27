#### ILRuntime如何进行热更新
- ILRuntime通过读取DLL文件，解析其中的IL指令
- 将IL指令转换为一个个方法的执行器(Evaluator)
- 在运行时解释执行这些IL指令，实现代码热更新
- 使用栈来管理方法调用和返回值

#### 跨域，以及跨域的注意事项

如果在热更工程中调用主工程的类或者方法，就会形成跨域。

注意事项：
1. 在调用主工程值类型的时候要用先绑定，或者写Adapter，否则会引发装箱拆箱，造成极大的性能损耗，跨域调用引用类型的时候注意内存管理，方式内存泄露
2. 在热更工程调用主工程的委托时，不管是Action还是Func<>, 都要写对应的adaptor
3. 在热更工程中使用Coroutine，需要注册adaptor
4. 在热更工程中可以继承主工程的类，但是实际上继承的事转换后的接口类ILInstance, 在特殊情况下会出现类型不匹配的错误，示例如下。
5. 如果热更 和 主工程需要实现相同的方法，使用接口而非继承
```c#
namespace MainProject
{
    public interface Imessage { }

    public class MessageTest : Imessage
    {
        public static Imessage GetMessage(MessageTest str)
        {
            //do some work

            return str;
        }
    }
}

namespace HotFix_Project.ILRuntime_UITest
{
    class CrossDomainInheritance : MessageTest
    {
        List<Imessage> messageList = new List<Imessage>();
        messageList.add(this); //此行编译出错
    }
}
```

#### CLR绑定 和 反射

ILR调用热更项目的方案就是使用反射调用，但是反射涉及装箱和拆箱，频繁使用会影响性能，所以就有了CLR绑定。

CLR绑定会形成一个缓存列表，之后主工程在调用热更中的方法或类型的时候会优先查找该缓存列表，找不到再反射

所以常用的方法用CLR绑定，偶尔使用可以用反射

#### 优化运行时性能

1. 采用CLR绑定方案，减少反射调用
2. 减少值类型跨域传递
3. 用对象池管理热更对象

#### 架构建议

1. 用接口而非集成
2. 划分主工程和热更之间的资源，哪一部分属于主工程，那一部分属于热更
3. 跨域的消息传递使用统一的事件系统

#### 为什么在热更中跨域调用主工程时需要注册adaptor

在使用ILR作为热更方案的时候，我们会生成CLR绑定，他是一个反射缓存，可以在主工程调用热更中方法时减少反射调用的次数，但这只是一个缓存问题，在另一方面，有时候还需要解决调用机制问题。因为热更和主工程是两个不同的域。例如下面这种情况：
```c#
// 主工程
public class BaseClass {
    public virtual void DoSomething() { }
}

// 热更代码
public class HotfixClass : BaseClass {
    public override void DoSomething() { }
}
```
当主工程调用BaseClass 中的虚方法DoSomething时，是发生在CLR域中的，CLR的虚方法表中没有热更中的这个方法，这个时候就需要adaptor将该方法注入到虚方法的调用链当中，当CLR调用该虚方法时，adaptor会接管该方法在热更中的调用