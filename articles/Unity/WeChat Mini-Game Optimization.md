## Drawcall Management

### Normal Drawcall standard
In one UI panel, the account of drawcall depends on different devices.

1. low-end mobile phone, the drawcall for each one UI panel is better to keep in 20-30
2. high-end mobile phone, 50-100
3. pc or game console, 50-150

### The influence factors

1. the complexity of UI panel. The dynamic UI can increase drawcall, but the static UI generates less drawcall.
2. atlases and materials, different atlases and materials can interrupts batching
3. text and font, text always use different materials or font families, cause batching interruption
4. transparent and mix mode, different transparent and mix mode also can cause batching interruption

### How to reduce Drawcall

1. one atlases for one panel. The image in one atlases use same material, so they only cause one drawcall. For example, in `panel_main`, you can pack all image used in same atlases to reduce drawcall. Sometimes the redundancy of image resources is caused to ensure this, this need a judgement. For me, if the redundancy assets only cause a little space, I will make them redundancy.
2. keep material or font-family of text in same
3. mange the layer of UI components, different UI sequence in Hierarchy can cause different batching result, for example `image-image-text` will generate 2 Drawcall, but `image-text-image` can generate 3 Drawcall.
4. use frame debugger. Unity has tools for Drawcall optimization, checking renderer sequence in frame debugger can help us to know how many batching is done.
5. separate dynamic and static UI. I usually set two canvas, one for dynamic UI, and one for static. 

Suppose you have a UI panel that contains the following elements:
- Background image (static)
- A fixed button (static)
- A timer (dynamic)
- A life bar (dynamic)
- An avatar (static)

```
StaticCanvas (Canvas)
    ├── BackgroundImage (Image)   
    ├── Avatar (Image)            
    └── Button (Button)           

DynamicCanvas (Canvas)
    ├── Timer (Text)              
    └── HealthBar (Slider)       

```

## Asset Management

To reduce the size of bundle, we need to manage our assets in the game. I want to record two points here.

1. Image assets: using photoshop to resize large pictures.
2. font: font also cost a lot of space, so we can use tool to font subsetting to reduce cost

Meanwhile, don't drag too much mono to Gameobjects, and we can generate it to scene when we need it. Too much mono in Hierarchy also cost a lot of space, this will make bundle large. 