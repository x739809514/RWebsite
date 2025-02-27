### 系统设计

通过CSV配置condition节点，然后通过自动化脚本生成condition node, 同时生成一个condition 节点仓库存放所有的condition node 以便后续查找。写一个接口定义所有condition node应该要实现的功能, 最后用一个管理类对外封装接口，并管理condition node中的方法。

### 实现

**ICondition 接口**
接口中定义所有条件节点中要实现的功能
```c#
public interface ICondition
{
	PutOn();
	PutOff();
	Check();
}
```

**Condition Node** 
```c#
public class Node10001: Icondition
{

}
```

**Condition 仓库类**
```c#
public class ConditionStore
{
		public Dictionary<int, ICondition> Store = new Dictionary<int, ICondition>() 
		{
			{ 100001, new N100001() },
			{ 100002, new N100002() },
			...
		}
}
```

**Condition Manager**
```c#
public class ConditionManager  
{  
    private readonly ConditionStore cStore = new();  
  
    public bool PutOn(int id, Player player)  
    {        
	    if (cStore.Store.TryGetValue(id, out var node))  
        {            
	        return node.PutOn(player);  
        }  
        return false;  
    }  
    
    public void PutOff(int id, Player player)  
    {        
	    if (cStore.Store.TryGetValue(id, out var node))  
        {            
	        node.PutOff(player);  
        }    
    }  
    
    public bool Check(int id, Player player)  
    {        
	    if (cStore.Store.TryGetValue(id, out var node))  
        {            
	        return node.Check(player);  
        }  
        return false;  
    }
}
```