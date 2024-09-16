## 多边形漏斗算法

### 核心思想

- 计算七点与第一条目标边界向量位置关系，明确左右向量。**（漏斗初始化）**

- 分别标记左右向量索引，在相邻多边形中，计算下一个左右店。

- 依次遍历所有极限，分别对比新位置向量与历史左右极限向量位置关系。

  - 左向向左，扩张漏斗；漏斗顶点不变，左极限向量不变，左拐点Lst（缓存）添加当前左极限点。

  - 左向向右，收缩漏斗；未越过右极限向量：漏斗顶点不变，左极限更新到左监测点，左拐点清空历史数据。

  - 左向向右，收缩漏斗，已越过右极限向量：添加当前右极限点为路径点；遍历右拐点Lst，**计算出右向最小角度偏移顶点**，更新漏斗顶点与右极限向量至合法状态。

    ---------------------------------------------------------------------------------------------------------

  - 右向向右，扩张漏斗；漏斗定点不变，右极限向量不变，右拐点Lst添加当前右极限点；

  - 右向向左，收缩漏斗，未越过左极限向量：漏斗顶点不变，右极限更新到右检测点，右拐点Lst清空历史数据。

  - 右向向左，收缩漏斗，已越过左极限向量：添加当前左极限点为路径点；遍历左拐点Lst，**计算出左向最小角度偏移顶点**，更新漏斗顶点与左极限向量至合法状态。

- 到达目标区域顶点时，分别以该点为左右收缩目标：

  - 在左极限左边，添加左点为拐点，目标点为终点
  - 在左右极限中间，可直通，目标点为终点；
  - 在右极限右边，添加右点为拐点，目标点为终点；

- 输出所有路径点

### 算法实现：

https://github.com/x739809514/PathFinding_Algorithms/tree/main/Assets/Scripts/FunnelAlgorithm

## A星算法

A*算法是一种广泛应用于图搜索和路径规划的算法，结合了Dijkstra算法的优点和启发式搜索的效率。它通过使用一个启发式函数来估计当前节点到目标节点的距离，从而在搜索过程中优先考虑那些看起来更有希望到达目标的路径。

下面是A*算法的实现步骤：

1. **初始化**：创建开放列表和关闭列表。开放列表包含需要评估的节点，关闭列表包含已经评估过的节点。

   ```c#
   private readonly PriorityQueue<NavArea> openList = new PriorityQueue<NavArea>(4); //优先级队列
   private readonly List<NavArea> closeList = new List<NavArea>();
   ```

2. **开始节点**：将起始节点添加到开放列表中。

   ```c#
   public List<NavArea> CalAStarPolyPath(NavArea start, NavArea end)
   {
       startArea = start;
       endArea = end;
       openList.Clear();
       closeList.Clear();
   
       openList.Enqueue(start);
       startArea.sumDistance = 0;
       
       // detect area...
       
   }
   ```

3. 迭代：重复以下步骤，直到找到目标节点或开放列表为空：

   - 从开放列表中选择具有最低f值的节点。f值是g值和h值之和，g值是从起点到当前节点的实际代价，h值是从当前节点到目标节点的估计代价。

   - 将该节点从开放列表移到关闭列表。
     ```C#
     while (openList.Count > 0)
     {
         if (openList.Contains(end))
         {
             pathList = GetPathNavAreas(end);
             showPathAreaHandle?.Invoke(pathList);
             closeList.Add(end);
             break;
         }
         // get the area has highest priority, add it to close list
         NavArea detectArea = openList.Dequeue();
         if (!closeList.Contains(detectArea))
         {
             closeList.Add(detectArea);
         }
     ```

   - 检查该节点的每一个相邻节点：

     - 如果相邻节点在关闭列表中，跳过。
     - 如果相邻节点不在开放列表中，将其添加进去，并设置相应的g值、h值和f值。
     - 如果相邻节点在开放列表中，但现在的g值更低，更新其g值、h值和f值。

     ```c#
     private void DetectNeighbourArea(NavArea detectArea, NavArea neighbourArea)
     {
         if (!closeList.Contains(neighbourArea))
         { 
             float neighborDistance = detectArea.CalNavAreaDis(neighbourArea);
             float newSumDistance = detectArea.sumDistance + neighborDistance;
             //update area's sumdistance
             if (float.IsPositiveInfinity(neighbourArea.sumDistance) || newSumDistance < neighbourArea.sumDistance)
             {
                 neighbourArea.preArea = detectArea;
                 neighbourArea.sumDistance = newSumDistance;
             }
     
             //if this is a new area
             if (!openList.Contains(neighbourArea))
             {
                 float targetDistance = neighbourArea.CalNavAreaDis(endArea); //cal H
                 neighbourArea.weight = neighbourArea.sumDistance + targetDistance; //f = g + h
                 openList.Enqueue(neighbourArea);
             }
         }
     }
     ```

4. **结束**：如果找到目标节点，构造路径；如果开放列表为空且没有找到目标节点，则表示没有可行路径。

### 最后完整代码

```C#
private NavArea startArea;
private NavArea endArea;

private readonly PriorityQueue<NavArea> openList = new PriorityQueue<NavArea>(4);
private readonly List<NavArea> closeList = new List<NavArea>();
private List<NavArea> pathList = new List<NavArea>();
/*private List<int> leftConnerLst = new List<int>();
private List<int> rightConnerLst = new List<int>();*/

public List<NavArea> CalAStarPolyPath(NavArea start, NavArea end)
{
    startArea = start;
    endArea = end;
    openList.Clear();
    closeList.Clear();

    openList.Enqueue(start);
    startArea.sumDistance = 0;
    while (openList.Count > 0)
    {
        if (openList.Contains(end))
        {
            pathList = GetPathNavAreas(end);
            showPathAreaHandle?.Invoke(pathList);
            closeList.Add(end);
            break;
        }
        // get the area has highest priority, add it to close list
        NavArea detectArea = openList.Dequeue();
        if (!closeList.Contains(detectArea))
        {
            closeList.Add(detectArea);
        }

        //continue detect neighbors of the above area
        for (int i = 0; i < detectArea.borderList.Count; i++)
        {
            NavBorder border = detectArea.borderList[i];
            NavArea neighbourArea = detectArea.areaID == border.areaID1
                ? areaArr[border.areaID2]
                : areaArr[border.areaID1];
            DetectNeighbourArea(detectArea, neighbourArea);
        }
    }

    return pathList;
}

/// <summary>
/// calculate priority for each neighbour area
/// </summary>
/// <param name="detectArea"></param>
/// <param name="neighbourArea"></param>
private void DetectNeighbourArea(NavArea detectArea, NavArea neighbourArea)
{
    if (!closeList.Contains(neighbourArea))
    { 
        float neighborDistance = detectArea.CalNavAreaDis(neighbourArea);
        float newSumDistance = detectArea.sumDistance + neighborDistance;
        //update area's sumdistance
        if (float.IsPositiveInfinity(neighbourArea.sumDistance) || newSumDistance < neighbourArea.sumDistance)
        {
            neighbourArea.preArea = detectArea;
            neighbourArea.sumDistance = newSumDistance;
        }

        //if this is a new area
        if (!openList.Contains(neighbourArea))
        {
            float targetDistance = neighbourArea.CalNavAreaDis(endArea); //cal H
            neighbourArea.weight = neighbourArea.sumDistance + targetDistance; //f = g + h
            openList.Enqueue(neighbourArea);
        }
    }
}

// output final path
private List<NavArea> GetPathNavAreas(NavArea end)
{
    List<NavArea> list = new List<NavArea>();
    list.Add(end);
    NavArea pre = end.preArea;
    while (pre != null)
    {
        list.Insert(0, pre);
        pre = pre.preArea;
    }

    int startID, endID;
    for (int i = 0; i < list.Count - 1; i++)
    {
        startID = list[i].areaID;
        endID = list[i + 1].areaID;
        string key;
        if (startID < endID)
        {
            key = $"{startID}-{endID}";
        }
        else
        {
            key = $"{endID}-{startID}";
        }

        list[i].targetBorder = GetBorderByAreaIDKey(key);
        //this.LogGreen($"{list[i].targetBorder.pointIndex1}---{list[i].targetBorder.pointIndex2}");
    }

    return list;
}
```

### 项目地址

https://github.com/x739809514/PathFinding_Algorithms/blob/main/Assets/Scripts/FunnelAlgorithm/NavFinder.cs
