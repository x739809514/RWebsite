在前几个，我完全抛弃了Unity Animation转而使用Playable手写了一个动画系统，这一次，我想只使用Animation System来制作游戏中AI的动画系统

### 方案

由于我感觉Unity Animation自带的状态机不是很好用，当动画资源和状态逐渐复杂后，整个状态机的切换十分混乱同时也会产生很多GC，所以为了我想只创建动画，但是不直接在状态机面板中连接状态节点，而是使用代码控制，Unity也提供了相关的API，例如 `animator.Play()`, `animator.crossFade()`等，所以我想将这些方法分装成一个AnimatorManager。
另外状态切换部分，手写一个状态机系统来进行管理。

### 系统设计

系统设计的主要方面是状态机系统，由于每个状态都会有一些同样的操作，`Enter`, `Exit`, `Update`, `FixUpdate`, `Check`, 所以我定义了一个接口，该接口中去定义上面这些方法。
```C#
public interface IState  
{  
    public void OnEnter();  
    public void OnExit();  
    public void OnUpdate();  
    public bool OnCheck();  
    public void OnFixUpdate();  
}
```
接着让状态节点们去各自实现该接口。同时我还需要一个状态的枚举和存储状态节点的字典。
```C#
public enum StateType  
{  
    Idle,  
    Run,  
    Jump,  
    Rush,  
    Fall,  
    Attack,
}
```
当然，一个状态管理类是必不可少的，该管理类用于管理状态之间的切换和向外提供API。
```C#
public class Fsm  
{  
    private Dictionary<StateType, IState> stateDics;  
    private IState curState;  
    public StateBoardData boardData;  
  
    public Fsm(StateBoardData boardData)  
    {        
	    
    }  
    public void AddState(StateType type, IState state)  
    {        
	      
	}  
    public void SwitchState(StateType stateType)  
    {         
    
    }  
    public void Update()  
    {       
    
    }  
    public void FixUpdate()  
    {        
     
    }
}
```
最后，我还需要一个白板类，该白板类的作用是在外部和状态机内部之间传递数据。
至于动画播放部分，可以在状态节点中去执行播放动画的指令，例如：
```C#
public void OnEnter()
{
	animator.play()
}
```

### 有限状态机解藕
1. 使用接口定义统一的行为
2. 把状态中重复的逻辑封装成函数放在工具类里

### Playable 和Animator的比较和思考

Playable 可以实现高度自定义，并且个timeline可以深度结合，可以用来实现过场动画的制作，还有一些角色特殊的动作，例如大招等。同时，playable对于动画的操作更加的细腻，可以自定义动画的过渡时间，可以无视状态自由的在动画之间切换，并且playable的节点是用树形结构展现的，更加直观。但是Playable使用起来也明显更复杂，需要系统设计者比较好的代码能力，否则可能会出现不必要的性能浪费。

Animator 有现成的API，并且有可视化的编辑界面，如果用于简单的动画表现，animator比playable会更方便使用， 但是animator内部的实现是一个黑盒，如果遇到复杂的状态切换逻辑，可能会出现不可预测的bug.

所以我的总结是如果是简单的动画切换和状态结构，用animator比较好，如果涉及到复杂且定制化较高的动画系统，用playable。