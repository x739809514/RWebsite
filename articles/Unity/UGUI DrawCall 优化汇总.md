因为一次Drawcall中CPU就会向GPU发送一次数据和指令，如果次数多了会影响性能，所以尽量减少drawcall.

  UGUI合批规则：
  1. 有两种不同的合批手段：动态合批 和 静态合批
  2. 合批以Canvas为单位，不同Canvas中的资源无法合批
  3. 使用不同材质的无法进行合批，只有相同材质的可以
  4. 使用graphic ray caster会中断合批
  5. 使用Mask和Clipping会中断合批

### 一些合批的技巧
1. 将同一个panel内使用的texture打成图集，如果是按钮，我会选择冗余，虽然会多占用一些存储空间，但是减少drawcall
2. 注意hierarchy中的组件排布，例如Image和text一般用的不同的material，这样会打断合批，最好把image和text分开放在一起
3. 把动态的UI和静态的UI分开，动态UI包括RectTransform的变换，Color中透明度的改变等，这些都会打断合批，不过只改变颜色不会打断合批(使用Property Block修改)
4. 保持类似UI组件材质和shader统一，使用shared material，ß或使用同一个material，用property block修改属性
5. 不要直接修改image的alpha，如果需要使用canvas group.alpha就用canvas group
6. 最后，用UI profile来检测draw call的数量