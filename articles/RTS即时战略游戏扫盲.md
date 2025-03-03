### 大量小兵的AI优化问题

例如现在场上有6支部队，每个部队有一千人，如何做优化？

方案：
1. 使用对象池来管理小兵，避免大量的GC，设置一定的缓冲时间来做对象池回收，避免频繁操作
2. 使用分层状态机，上层管理部队，例如移动和攻击，下层管理单一小兵，比如避障，还需要做数据分离，小兵和部队单独的数据类，例如小兵需要控制血量，射箭的距离和初速度
3. 分帧计算，例如场上6支部队，分成6帧来计算，因为部队和部队之间的延迟行动我觉得是可以接受的

### Flocking 群体行为

Flocking 算法用于控制群体中的的个体之间不会相互碰撞，会按照群体的方向前进，不会让个体过于分散

首先有一个个体类， 设置个体的速度，位置，加速度，宽高等，类中有三个核心函数，分别计算个体之间的分离力，对齐力，凝聚力，最后对这三个力施加权重

每个力的计算步骤：
- 检查感知范围内的领居
- 计算所需要的转向力
- 限制力的大小
- 应用权重系数