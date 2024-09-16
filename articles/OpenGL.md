## Configure OpenGL In Mac

First of all you need to install a few things, CMake, GLFW, GLAD, Vscode. here is the download path
CMake: [CMake](https://cmake.org)
GLFW: [GLFW-Download](https://www.glfw.org/download.html)
Glad: [glad](https://glad.dav1d.de)
VsCode is installed correctly!
Create three directories under the project file, src, include, and lib.

### Install Cmake

Apple app normal installation method

### Install GLFW

First of all, download the mac binary file from the official website, after downloading the file format is like this:

```
├── LICENSE.md
├── README.md
├── docs
├── include
├── lib-arm64
├── lib-universal
└── lib-x86_64
```

There are two main directories used in this directory.
Firstly, choose lib-xxx according to your chip type, if you are an intel (x86) chip, then choose lib-x86-64, if you are a newer version of the m1 or m2 chip (arm) then choose lib-arm64. in addition to this, lib-universal is said to be compatible with both types of chips, but due to the lack of a machine, the author has not tested it. , the author did not test it, interested students can test it by themselves.
Secondly, besides lib-xxx, one more directory to use is the files in the include directory, the rest of the files and directories can be deleted and not retained.
This is the end of GLFW download.

### Install Glad

Firstly go to the glad download page and download the glad file, here you need to choose a few options, after selecting it, click generate, then download a .zip file, unzip it and the file directory will look like this:

```
  glad
  ├── include
  │   ├── KHR
  │   │   └── khrplatform.h
  │   └── glad
  │       └── glad.h
  └── src
      └── glad.c
```

### Project structure configuration

Create the working directory new_openGL and create the folders include, lib and src, and move the files in the GLAD and GLFW directories to the corresponding directories:

```
glfw-3.3.8.bin.MACOS/include/GLFW/  ->  new_openGL/include/GLFW/
glfw-3.3.8.bin.MACOS/lib-arm64/*   ->  new_openGL/lib/
glad/include/glad/  ->  new_openGL/include/glad/
glad/include/KHR/   ->  new_openGL/include/KHR/
glad/src/glad.c  ->. new_openGL/src/glad.c
```

When the move is complete, the catalogue structure looks like this:

```
new_openGL
├── include
│   ├── GLFW
│   │   ├── glfw3.h
│   │   └── glfw3native.h
│   ├── KHR
│   │   └── khrplatform.h
│   └── glad
│       └── glad.h
├── lib
│   ├── libglfw.3.dylib
│   └── libglfw3.a
└── src
    └── glad.c
```

### Project testing and compilation

1. Create the file main.cpp in the src/ directory of the project and write the following program:

```c++
#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <stdio.h>
#include <stdlib.h>
#include <iostream>

void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
    glViewport(0, 0, width, height);
} 

void processInput(GLFWwindow *window)
{
    if(glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
        glfwSetWindowShouldClose(window, true);
}
int main()
{
    glfwInit();
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE); //MAC OSX needs

    GLFWwindow* window = glfwCreateWindow(800, 600, "LearnOpenGL", NULL, NULL);
    if (window == NULL)
    {
        std::cout << "Failed to create GLFW window" << std::endl;
        glfwTerminate();
        return -1;
    }
    glfwMakeContextCurrent(window);

    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress))
    {
        std::cout << "Failed to initialize GLAD" << std::endl;
        return -1;
    }   

    glViewport(0, 0, 800, 600);
    while(!glfwWindowShouldClose(window))
    {
        processInput(window);

        glClearColor(0.9f, 0.3f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);
        glfwSwapBuffers(window);
        glfwPollEvents();    
    }
    glfwTerminate();
    
    return 0;
}
```

2. Create a CMakeLists.txt file in the root directory of the project and copy the following statements into it:

```Cmake
cmake_minimum_required(VERSION 3.0.0)
project(HelloGL VERSION 0.1.0)

# 使用 C++ 17 标准
set(CMAKE_CXX_STANDARD 17)

# 设置代码文件
set(SRC_DIR ${PROJECT_SOURCE_DIR}/src/)

# 添加头文件
set(HEADER_DIR ${PROJECT_SOURCE_DIR}/include/)
set(LIB_DIR ${PROJECT_SOURCE_DIR}/lib/)
include_directories(${HEADER_DIR} ${LIB_DIR})

# 添加目标链接
set(GLFW_LINK ${LIB_DIR}libglfw.3.dylib)
link_libraries(${GLFW_LINK})

# 执行编译命令
set(SOURCES ${SRC_DIR}glad.c ${SRC_DIR}main.cpp)
add_executable(HelloGL ${SOURCES})

# 链接系统的 OpenGL 框架
if (APPLE)
    target_link_libraries(HelloGL "-framework OpenGL")
endif()

include(CTest)
enable_testing()

set(CPACK_PROJECT_NAME ${PROJECT_NAME})
set(CPACK_PROJECT_VERSION ${PROJECT_VERSION})
include(CPack)
```

The file directory at this point is:

```
new_openGL
├── CMakeLists.txt
├── include
│   ├── GLFW
│   │   ├── glfw3.h
│   │   └── glfw3native.h
│   ├── KHR
│   │   └── khrplatform.h
│   └── glad
│       └── glad.h
├── lib
│   ├── libglfw.3.dylib
│   └── libglfw3.a
└── src
    ├── glad.c
    └── main.cpp
```

3. Create a build directory in the project root directory, go to the build directory and execute:.

```
mkdir build
cd build
cmake ..
```

Then you will see a lot of files generated in the build folder, the main one is the makefile, with this file, we can enter the command make in the build folder, and then you can see the output on the command line:

```
(base) liushanlin@192 build % make
[ 33%] Building C object CMakeFiles/HelloGL.dir/src/glad.c.o
[ 66%] Building CXX object CMakeFiles/HelloGL.dir/src/main.cpp.o
[100%] Linking CXX executable HelloGL
[100%] Built target HelloGL
```

Finally type the command . /HelloGL and you will see a red window.

## Start with Document

In a nutshell, OpenGL is actually a general-purpose graphics specification that provides only an API interface, a middle layer. The specific implementation is on the graphics card driver, which is for better cross-platform implementation. So in order to become an OpenGL master, we need to read more documentation.

### 示例代码

```c++
#include <glad/glad.h>
#include <GLFW/glfw3.h>

#include <stdio.h>
#include <stdlib.h>
#include <iostream>

int main()
{
    if (glfwInit() == false)
    {
        return -1;
    }
    // set opengl version, here is 3.3
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    // set opengl config file
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    // make opengl forward compat, that means forbid some functions in opengl 2.x which area abandoned
    glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);

    GLFWwindow *window = glfwCreateWindow(800, 600, "MyFirstOpenGLWin", NULL, NULL);
    if (window == NULL)
    {
        std::cout << "fail to create a window" << std::endl;
        // release assets when window quits
        glfwTerminate();
        return -1;
    }
    glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);

    // make cur thread context is the opengl context
    glfwMakeContextCurrent(window);
    // glad is a library which is used to manage function pointer of opengl
    // since opengl is cross-platform, it doesn't bind function to any specific platform
    // so we need to get pointers form opengl and manage them
    if (gladLoadGLLoader((GLADloadproc)glfwGetProcAddress) == false)
    {
        std::cout << "fail to load glad" << std::endl;
        return -1;
    }
    glViewport(0, 0, 800, 600);
   
    // start rendering
    while (glfwWindowShouldClose(window) == false)
    {
        // detect key escape event
        processInput(window);
        // set clear color
        glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
        // clear color buffer
        glClear(GL_COLOR_BUFFER_BIT);
        // double buffer tech
        glfwSwapBuffers(window);
        // func call all the event since the last call
        glfwPollEvents();
    }
    glfwDestroyWindow(window);
    glfwTerminate();
    return 0;
}
```

The above code is used to build a window, first of all we need to call to two libraries, that is, #include <glad/glad.h>, #include <GLFW/glfw3.h>, where glad library is used to manage all the OpenGL function pointers, as mentioned above, because OpenGL is a cross platform specification, so he will not bind any function to a specific platform, we need to use glad to achieve the function dynamic loading. Because OpenGL is a cross-platform specification, it doesn't bind any functions to specific platforms, and we need to dynamically load functions through glad.

Let's move on to the next few lines of code:

```c++
if (glfwInit() == false)
{
    return -1;
}
// set opengl version, here is 3.3
glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
// set opengl config file
glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
// make opengl forward compat, that means forbid some functions in opengl 2.x which area abandoned
glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
```

This code is used to initialise the window, first to initialise OpenGL, then to set the version of OpenGL, the configuration file, and the last line above is used to disable some of the methods that have been discarded in the previous version of OpenGL.

Then create the window:

```c++
 GLFWwindow *window = glfwCreateWindow(800, 600, "MyFirstOpenGLWin", NULL, NULL);
if (window == NULL)
{
    std::cout << "fail to create a window" << std::endl;
    // release assets when window quits
    glfwTerminate();
    return -1;
}
glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);
```

`glfwTerminate()` is used to release the resources occupied by the window, just like the C++ destructor function

The next few lines of code are used to set the context of the current window and initialise glad

```c++
glfwMakeContextCurrent(window);
// glad is a library which is used to manage function pointer of opengl
// since opengl is cross-platform, it doesn't bind function to any specific platform
// so we need to get pointers form opengl and manage them
if (gladLoadGLLoader((GLADloadproc)glfwGetProcAddress) == false)
{
    std::cout << "fail to load glad" << std::endl;
    return -1;
}
glViewport(0, 0, 800, 600);
```

Then there's rendering, which I understand to be like `onGUI()` in the unity editor, where he'll keep rendering the contents of the window to be displayed in a loop:

```c++
// start rendering
while (glfwWindowShouldClose(window) == false)
{
    // detect key escape event
    processInput(window);
    // set clear color
    glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
    // clear color buffer
    glClear(GL_COLOR_BUFFER_BIT);
    // double buffer tech
    glfwSwapBuffers(window);
    // func call all the event since the last call
    glfwPollEvents();
}
```

The final step is to close the window and release the resources:

```c++
glfwDestroyWindow(window);
glfwTerminate();
```

The above is the explanation of the code.

## Drawing Triangles

### rendering pipeline

Before drawing the triangles, we can have a general idea of the GPU's rendering pipeline, which is roughly divided into the following steps.

1. Prepare vertex data
2. Shading stages (vertex shader, surface subdivision shader, geometry shader)
3. projector
4. cutting off
5. screen mapping
6. assembly of graphics
7. triangle traversal
8. antialiasing
9. coloration of film elements
10. slice-by-slice operation
11. Various tests (crop, transparency, template, depth test)

All of them 6-11 belong to the rasterisation stage, which is how the graphics processed in 1-5 are drawn in the window. In this rendering pipeline, the shading stage and the piecewise shading are programmable, that is, through shaders.However, it is important to note that for the vertex shader, it is executed as many times as there are vertices, whereas the piecewise shader is pixel-specific because it has to colour the pixels, for example, when drawing a triangle, which has three vertices, then the vertex shader will be executed three times, and where the There may be 50 pixels covered in the triangle, then the piecewise shader will be executed 50 times, so in general the behaviour performed in the piecewise shader will be more expensive and most of the operations will be put into the vertex shader to be performed.

### Writing Shaders in OpenGL

It can be roughly divided into the following steps，`CreateProgram`  `CreateShader()` `CompileShader()` `AttachShader` `LinkProgram()` `ValidateProgram()` 。

```c++
static unsigned int CreateShader(std::string &vertextShader, std::string &fragmentShader)
{
    unsigned int program = glCreateProgram();
    unsigned int vs = CompileShader(GL_VERTEX_SHADER,vertextShader);
    unsigned int fs = CompileShader(GL_FRAGMENT_SHADER,fragmentShader);
    glAttachShader(program,vs);
    glAttachShader(program,fs);
    glLinkProgram(program);
    glValidateProgram(program);
    glDeleteShader(vs);
    glDeleteShader(fs);
    return program;
}

static unsigned int CompileShader(unsigned int type, std::string &source)
{
    unsigned int id = glCreateShader(type);
    const char *str = source.c_str();
    glShaderSource(id, 1, &str, NULL);
    glCompileShader(id);

    //Error handing
    int success;
    glGetShaderiv(id,GL_COMPILE_STATUS,&success);
    if(success == GL_FALSE)
    {
        int length;
        glGetShaderiv(id,GL_INFO_LOG_LENGTH,&length);
        char* info = (char*)alloca(length*sizeof(char));
        glGetShaderInfoLog(id,length,&length,info);
        std::cout<< "Error: "<< (type == GL_VERTEX_SHADER ? "vertex shader" : "fragment shader") << "Shader Compiled Failed!"<< info << std::endl;
        glDeleteShader(id);
        return 0;
    }

    return id;
}
```

Since OpenGL is a very unstable API, subtle errors can prevent graphics from being drawn, so we can provide error messages in a number of ways such as `glGetShaderiv` `glGetShaderInfoLog`.

Also note that we need a VAO (vertex array object) and a VBO (vertex cache object) to manage the vertex data.

```c++
unsigned int VAO;
glGenVertexArrays(1,&VAO);
glBindVertexArray(VAO);
```

### What to do with these Shaders

The method of writing shader above, using the string form directly would make the writing too complicated, so we can write the shader script in a special file, and finally read and write it as a character stream. Here we can call `fstream` and `sstream` from the c++ stl library, as in the following code:

```c++
static ShaderProgram ParseShader(const std::string filepath)
{
  std::ifstream inFile(filepath);
  std::string line;
  ShaderType type = ShaderType::None;
  std::stringstream ss[2];

  while (getline(inFile,line))
  {
      if(line.find("#Shader")!=std::string::npos)
      {
          if(line.find("vertex")!=std::string::npos)
          {
              // get vertex str
              type = ShaderType::Vertex;
          }else if(line.find("fragment")!=std::string::npos)
          {
              // get fragment str
              type = ShaderType::Fragment;
          }
      }else{
          ss[(int)type] << line << '\n';
      }
  }
  inFile.close();
  return {ss[0].str(),ss[1].str()};
}
```

### index array

When we want to draw a rectangle, we can think of it as having two triangles, so we can make the following adjustments to our vertex array:

```c++
float positions[] = {
        -0.5f, -0.5f, //0
        0.5f, -0.5f,  //1
        0.5f, 0.5f,   //2
        0.5f, 0.5f,   //3
        -0.5f, 0.5f,  //4
        -0.5f, -0.5f, //5
        };

//同时修改draw call
glDrawArrays(GL_TRIANGLES,0,6);
```

But observing the vertex array above, we can find that there are many vertices that are duplicated, which creates a lot of wasted computation when the number of triangles is very high, to solve this problem, we can create another array - the indexed array.

The index array holds the index of the vertices to be used for the triangle in the vertex array, if I labelled each vertex in the above array:

```c++
unsigned int indices[]={
        0,1,2,
        2,3,0
    };
```

Also modify the vertex array

```c++
float positions[] = {
        -0.5f, -0.5f,
        0.5f, -0.5f,
        0.5f, 0.5f,
        -0.5f, 0.5f,
        };
```

Next, as before, we need to save the index array to the VBO.

```c++
unsigned int ido;
glGenBuffers(1, &ido);
glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ido);
glBufferData(GL_ELEMENT_ARRAY_BUFFER, 6 * sizeof(unsigned int), indices, GL_STATIC_DRAW);
```

Note here that we are using `GL_ELEMENT_ARRAY_BUFFER` this time. Also in the render loop, we need to change drawcall to:

```c++
glDrawElements(GL_TRIANGLES,6,GL_UNSIGNED_INT,nullptr);
```

In particular, note that unsigned int must be used, because unsigned int is non-negative, does not have a negative index, and because unsigned int is 32-bit, provides a large enough storage range without taking up as much memory as 64-bit.

### Relevant information

OpenGL API：https://docs.gl/

Rendering pipeline related knowledge：https://zhuanlan.zhihu.com/p/137780634

## Handling Errors in OpenGL

When using OpenGL to create graphics it is very easy to end up with a black window because of some errors, so we need some way to debug errors as we normally do with code.OpenGL gives us some ways to do this, and the next two are described below.

1. glGetError()
   glGetError() returns an error code, and we need to cross-reference the error code in the documentation or in the code to find the exact error, which seems a bit cumbersome, but we can combine it with c++ macro commands to make debugging work. The general idea is that we now clear all previously detected errors in front of the code we suspect has a problem, and then call glGetError() again after that code to detect the error. Example:

   ```c++
   //清除错误
   static void ClearError()
   {
       while (glGetError()!=GL_NO_ERROR);
   }
   //重新检测错误
   static bool CheckError(const char* func, const char* file, int line)
   {
       while (GLenum error = glGetError())
       {
           std::cout << "[OpenGL error:]" << error << file << ": " << line << std::endl;
           return false;
       }
       return true;
   }
   ```

   ```c++
   ClearError();//清空错误
   glDrawElements(GL_TRIANGLES,6,GL_INT,nullptr);//改行代码是有问题的
   CheckError();//检测错误
   ```

   The above code can already output the location of the file in error and the number of lines in error, but it is not good enough, we hope that when a line of code error, so that the programme automatically stops at that line, so that we can facilitate the direct modification. To achieve this function, we can use the macro command.

   ```c++
   #define ASSERT(x) if(!(x)) __debugbreak();
   #define GLCALL(x) ClearError();\ //这里的反斜杠是为了忽视换行
           x;\
           ASSERT(CheckError(#x, __FILE__,__LINE__))
   ```

   The __debugbreak() function above seems to be windows-only, I didn't find that function in Mac, and I don't know what function to call under Mac to achieve the same effect yet 。。。。 Grief! Immediately after that we can use it by just wrapping it in a macro where we want to call it, hi!

2. Error Callback Functions: In OpenGL 4.3 and above, you can use the glDebugMessageCallback function to set up error callback functions to be called automatically to handle errors when they occur. This makes it easier to catch and handle OpenGL errors.

   ```c++
   void GLAPIENTRY errorCallback(GLenum source, GLenum type, GLuint id, GLenum severity, GLsizei length, const GLchar* message, const void* userParam) {
       // 处理错误信息
   }
   
   // 设置错误回调函数
   glDebugMessageCallback(errorCallback, nullptr);
   ```

### OpenGL中的uniform

Uniform in OpenGL is a special modification (like static, readonly) whose main purpose is to pass data between shader programs, e.g. between vertex shader and fragment shader.

The uniform has several characteristics：

1. He is global, which means that several different shaders can access the
2. He is read-only and cannot be modified after being defined in the shader
3. According to 2, if we want to change the uniform variable, we have to set it in the CPU and pass in the value.
4. He can be of various types, such as float, int, vector, matrix

Next put a code showing how to define a uniform variable and set him in the CPU:

```glsl
//.shader
layout(location=0) out vec4 color;

uniform vec4 u_color;

void main()
{
    color = u_color;
}
```

```c++
//.cpp
int location = glGetUniformLocation(shader,"u_color");
float r=0.0f;
float increment=0.0f;

while (glfwWindowShouldClose(window) == false)
{
		//other operation
		if(location!=-1)
    {
        glUniform4f(location,r,0.8f,0.5f,1.0f);
    }
    if (r>=1.0f)
    {
        increment-=0.2f;
    }else if(r<=0.0f)
    {
        increment+=0.2f;
    }
    r+=increment;
		//other operation
}
```

### Vertex Array Object

When we use `glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE)` we need to set up a VAO manually by ourselves, if we use `GLFW_OPENGL_COMPAT_PROFILE` there will be a VAO with default value. Let's start by looking at the code that sets up the VAO.

```	c++
//1
unsigned int VAO;
glGenVertexArrays(1,&VAO);
glBindVertexArray(VAO);
//2
unsigned int buffer;
glGenBuffers(1, &buffer);
glBindBuffer(GL_ARRAY_BUFFER, buffer);
glBufferData(GL_ARRAY_BUFFER, 6 * 2 * sizeof(float), positions, GL_STATIC_DRAW);
//3
glEnableVertexAttribArray(0);
//4
glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 2 * sizeof(float), 0);
```

It's a bit abstract to look at it this way, and it's still hard to see how the VAO is assigned. The process is roughly like this: first the code at 2 creates a VBO (Vertex Buffer Object), and then the code at 4 associates the buffer at 2 with the VAO at 1. In addition, if we want to bind a different buffer, we just need to add +1 to the first parameter of the function at 4. If we want to bind a different buffer, we just need to +1 the first parameter of the function at 4, and the new buffer will be linked to the VAO again.

Also the explanation given by Chatgpt is this:
*Use the `glBindVertexArray` function to bind this generated VAO to the current vertex array object. This means that the next OpenGL function calls affect this bound VAO.*

## OOP in OpenGL

Directly writing logic in `main.cpp` can be complex and difficult to maintain. So we can  use classes and object to make code cleaner.

### Vertex Layout

In the previous code, in order to draw two triangles, we define 4 groups of coordinates (in order to save space), so now we need to define a layout which can tell gpu how to manage our data. 

So first, we need to create a class which is called `VertexLayout`,  in this part, we should define a stride, as one coordinate needs two value to represent, x and y, so here we define stride as 2. In addition, in order to make the function normalised, we can make the function be templated. 

In addition, we also need to define a struct, which contains some parameters, such as type, count(stride in array) and  a bool parameter which represents if it is normalized. Here is the code:

```c++
struct VertexLayoutElement
{
    unsigned int type;
    unsigned int count;
    unsigned char isNormalise;

    static unsigned int GetSizeOfType(unsigned int  type)
    {
        switch (type)
        {
        case GL_FLOAT: return 4; 
        case GL_UNSIGNED_INT: return 4;
        case GL_UNSIGNED_BYTE: return 1;
        }
        return 0;
    }
};

class VertexLayout
{
private:
    std::vector<VertexLayoutElement> m_elements;
    unsigned int m_stride;
public:
    VertexLayout(/* args */);
    ~VertexLayout();

    template <typename T>
    void Push(unsigned int type)
    {
    }

    std::vector<VertexLayoutElement> GetLayoutElements();
    unsigned int GetStride();
};


VertexLayout::VertexLayout():m_stride(0)
{

}

VertexLayout::~VertexLayout()
{
}

std::vector<VertexLayoutElement> VertexLayout::GetLayoutElements()
{
    return m_elements;
}

unsigned int VertexLayout::GetStride()
{
    return m_stride;
}

template<>
void VertexLayout::Push<float>(unsigned int count) // here count is stride for array
{
    m_elements.push_back({GL_FLOAT,count,GL_FALSE});
    m_stride+=count * VertexLayoutElement::GetSizeOfType(GL_FLOAT); //stride * size of type is the real stirde
}

template<>
void VertexLayout::Push<unsigned char>(unsigned int count)
{
    m_elements.push_back({GL_UNSIGNED_BYTE,count,GL_TRUE});
    m_stride+=count * VertexLayoutElement::GetSizeOfType(GL_UNSIGNED_BYTE);
}

template<>
void VertexLayout::Push<unsigned int>(unsigned int count)
{
    m_elements.push_back({GL_UNSIGNED_INT,count,GL_FALSE});
    m_stride+= count * VertexLayoutElement::GetSizeOfType(GL_UNSIGNED_INT);
}]
```

### Vertex Array & Vertex Buffer

Then, we deal with the vertexes, in our previous code, we do something like this:

```c++
glBindVertexArray(VAO);

unsigned int buffer;
glGenBuffers(1, &buffer);
glBindBuffer(GL_ARRAY_BUFFER, buffer);
glBufferData(GL_ARRAY_BUFFER, 6 * 2 * sizeof(float), positions, GL_STATIC_DRAW);

glEnableVertexAttribArray(0);
glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 2 * sizeof(float), 0);

glBindVertexArray(0);
```

Now, we can create two  classes to wrap it, according to the code, we need to classes: `VertexArray` and  `VertexBuffer` and in `VertextArray` , we need 3 basic methods, `Bind()`, `UnBind()`, `AddBuffer()`, of course, we also need `Constructor()`. Here is the code.

```c++
class VertexArray
{
private:
    unsigned int renderId;
public:
    VertexArray(unsigned int renderID);
    ~VertexArray();
    void AddBuffer(VertexBuffer& buffer,VertexLayout& layout);
    void Bind() const;
    void UnBind() const;
};

VertexArray::VertexArray(unsigned int id) : renderId(id)
{
    glGenVertexArrays(1,&renderId);
}

VertexArray::~VertexArray()
{
    glDeleteVertexArrays(1,&renderId);
}
// here we need to bind buffer before we set vertex array, since we need input our data to buffer, so we need to create an another class VeretxBuffer.
void VertexArray::AddBuffer(VertexBuffer &buffer, VertexLayout &layout)
{
    Bind();
    buffer.Bind();
    const auto lyVec = layout.GetLayoutElements();
    unsigned int offset = 0;
    for (unsigned int i = 0; i < lyVec.size(); i++)
    {
        std::cout << i << std::endl;
        auto ele = lyVec[i];
        glEnableVertexAttribArray(i);
        auto size = ele.GetSizeOfType(ele.type);
        glVertexAttribPointer(i, ele.count, ele.type, ele.isNormalise, layout.GetStride(), (const void *)offset);
        offset += ele.count * VertexLayoutElement::GetSizeOfType(ele.type);
    }
}

void VertexArray::Bind() const
{
    glBindVertexArray(renderId);
}

void VertexArray::UnBind() const
{
    glBindVertexArray(0);
}
```

Meanwhile,  we also need a class `VertexBuffer`,  in this class, we need `Bind()`, `UnBind()` and `Constructor`. Here is the code:

```c++
class VertexBuffer
{
private:
    unsigned int bufferId;

public:
    VertexBuffer(unsigned int size, const void *data);
    virtual ~VertexBuffer();
    void Bind();
    void UnBind();
};

VertexBuffer::VertexBuffer(unsigned int size, const void *data)
{
    glGenBuffers(1, &bufferId);
    glBindBuffer(GL_ARRAY_BUFFER, bufferId);
    glBufferData(GL_ARRAY_BUFFER, size, data, GL_STATIC_DRAW);
}

VertexBuffer::~VertexBuffer()
{
    glDeleteBuffers(1, &bufferId);
}

void VertexBuffer::Bind()
{
    glBindBuffer(GL_ARRAY_BUFFER, bufferId);
}

void VertexBuffer::UnBind()
{
    glBindBuffer(GL_ARRAY_BUFFER, 0);
}
```

Finally, we can modify our `main.cpp`, firstly, we can use `VertexLayout` to add coordinates, then we can use  `VertexArray` and `VertexBuffer` to save data into GPU. Here is the code:

```c++
VertexBuffer vb(4 * 4 * sizeof(float), positions);

VertexLayout vl;
vl.Push<float>(2);
vl.Push<float>(2);
VertexArray va(VAO);
va.Bind();
va.AddBuffer(vb, vl);
```

### IndexBuffer

An Index Buffer Object (IBO), also known as an Element Buffer Object (EBO) in some contexts, is used in OpenGL and other graphics APIs to optimize the rendering of geometric shapes by reducing the amount of duplicated vertex data. It allows for the reuse of vertices to draw multiple polygons, which is particularly beneficial when rendering complex models or shapes.

When drawing shapes like a square or cube, some vertices are shared between multiple faces. Without an IBO/EBO, each face of the shape would need to be defined separately, including the vertices that are shared between faces, leading to a larger amount of vertex data than is actually necessary. By using an IBO, you can define the unique vertices of the shape once in a Vertex Buffer Object (VBO), and then use the IBO to specify the indices of these vertices in the order they should be drawn. This means shared vertices are stored once and reused, making the data more compact and the rendering process more efficient.

The process of using an IBO involves:

1. **Creating and binding an IBO**: Similar to other buffer objects in OpenGL, you create an IBO using `glGenBuffers`, and bind it with `glBindBuffer` using the target `GL_ELEMENT_ARRAY_BUFFER`.
2. **Uploading index data to the IBO**: After binding, index data is uploaded to the IBO using `glBufferData`. This data represents the order in which vertices in the VBO should be drawn.
3. **Drawing with the IBO**: Instead of using `glDrawArrays` to draw the vertices, `glDrawElements` is used. This function reads the indices from the currently bound IBO and uses them to fetch the vertex data from the currently bound VBO, drawing the shapes accordingly.

IBOs make the rendering process more memory-efficient and can significantly improve performance, especially for complex 3D models where many vertices are shared across faces.

```c++
class IndexBuffer
{
private:
    unsigned int bufferId;
public:
    IndexBuffer(unsigned int size, const void *data);
    virtual ~IndexBuffer();
    void Bind() const;
    void UnBind() const;
};

IndexBuffer::IndexBuffer(unsigned int size, const void *data)
{
    glGenBuffers(1, &bufferId);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, bufferId);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, size, data, GL_STATIC_DRAW);
}

IndexBuffer::~IndexBuffer()
{
    glDeleteBuffers(1, &bufferId);
}

void IndexBuffer::Bind() const
{
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, bufferId  );
}

void IndexBuffer::UnBind() const
{
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
}
```

### Renderer

About renderer, we also can encapsulate it into a class, in this class, we can define a method which can process drawing, we can just move all drawing code form `glfwWindowShouldClose` in `main.cpp`. This is the final result:

```c++
class Renderer
{
public:
        Renderer(/* args */);
        ~Renderer();
        void Clear();
        void Draw(const VertexArray& va, const IndexBuffer& ib, const Shader& Shader) const;
};

Renderer::Renderer()
{
}

Renderer::~Renderer()
{
}

void Renderer::Clear()
{
    glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
}

void Renderer::Draw(const VertexArray &va, const IndexBuffer &ib, const Shader &shader) const
{
    va.Bind();
    ib.Bind();
    shader.Bind();
    glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, nullptr);
}

//in main.cpp
Renderer renderer;
/* doing something */
while (glfwWindowShouldClose(window) == false)
{
  // ....
  renderer.Draw(va, indexBuffer, shader);
  // ...
}
```

## OOP in OpenGL(2) - Shader & Texture

In the previous code, We've encapsulated some classes to make the code easier to maintain，in this section, we start to process shader and texture.

### Shader

In OpenGL , we convert shader scripts to string and then use some API to load them into GPU. Generally, we use these API below:

```c++
glCreateShader() 	// to create a shader object
glShaderSource() 	// attach shader code to shader object
glCompileShader() // compile shader object
glGetShaderiv() & glGetShaderInfoLog()		//check compile error for shader
glCreateProgram() // create a shader program
glAttachShader()	// attach shader object to program
glLinkProgram()		// link all shader attach to program to a whole program
glGetProgramiv() & glGetProgramInfoLog()	// check link error for shader program
glUseProgram()		//Make your application part of the current rendering state
glDeleteProgram()	//delete shader program when shader and program don't be need anymore
```

So we should create a class to encapsulate these functions. First,  we can define a function to implement `glCreateShader`, `glShaderSource`, `glCompileShader` `glGetShaderiv` & `glGetShaderInfoLog`, then define a function to implement shader program. 

Here, we create to function `CompileShader` and `CreateShader`:

```c++
unsigned int Shader::CompileShader(unsigned int type, std::string &source)
{
    unsigned int id = glCreateShader(type);
    const char *str = source.c_str();
    glShaderSource(id, 1, &str, NULL);
    glCompileShader(id);

    // Error handing
    int success;
    glGetShaderiv(id, GL_COMPILE_STATUS, &success);
    if (success == GL_FALSE)
    {
        int length;
        glGetShaderiv(id, GL_INFO_LOG_LENGTH, &length);
        char *info = (char *)alloca(length * sizeof(char));
        glGetShaderInfoLog(id, length, &length, info);
        std::cout << "Error: " << (type == GL_VERTEX_SHADER ? "vertex shader" : "fragment shader") << "Shader Compiled Failed!" << info << std::endl;
        glDeleteShader(id);
        return 0;
    }

    return id;
}

unsigned int Shader::CreateShader(std::string &vertextShader, std::string &fragmentShader)
{
    unsigned int program = glCreateProgram();
    unsigned int vs = CompileShader(GL_VERTEX_SHADER, vertextShader);
    unsigned int fs = CompileShader(GL_FRAGMENT_SHADER, fragmentShader);
    glAttachShader(program, vs);
    glAttachShader(program, fs);
    glLinkProgram(program);
    glValidateProgram(program);
    glDeleteShader(vs);
    glDeleteShader(fs);
    return program;
}
```

Also, we need a function to parse the shader script:

```c++
ShaderProgram Shader::ParseShader()
{
    std::ifstream inFile(filePath);
    std::string line;
    ShaderType type = ShaderType::None;
    std::stringstream ss[2];

    while (getline(inFile, line))
    {
        if (line.find("#Shader") != std::string::npos)
        {
            if (line.find("vertex") != std::string::npos)
            {
                // get vertex str
                type = ShaderType::Vertex;
            }
            else if (line.find("fragment") != std::string::npos)
            {
                // get fragment str
                type = ShaderType::Fragment;
            }
        }
        else
        {
            ss[(int)type] << line << '\n';
        }
    }
    inFile.close();
    return {ss[0].str(), ss[1].str()};
}
```

What's more, in this class,  we expect to convey data to GPU, so we need some functions to convey data to uniform in shader:

```c++
int Shader::GetLocationOfUniform(const std::string &name)
{
    if (m_uniformLocationMap.find(name) != m_uniformLocationMap.end())
    {
        return m_uniformLocationMap[name];
    }
    int location = glGetUniformLocation(renderID, name.c_str());
    if (location == -1)
    {
        std::cout << "warning: uniform" << name << "doesn't exits !" << std::endl;
    }
    else
    {
        m_uniformLocationMap[name] = location;
    }

    return location;
}

void Shader::SetUniform4f(const std::string &name, float v0, float f0, float f1, float f2)
{
    glUniform4f(GetLocationOfUniform(name), v0, f0, f1, f2);
}

void Shader::SetUniform1i(const std::string &name, int value)
{
    glUniform1i(GetLocationOfUniform(name), value);
}

void Shader::SetUniform1f(const std::string &name, float value)
{
    glUniform1f(GetLocationOfUniform(name), value);
}

void Shader::SetUniformMat4f(const std::string &name, const glm::mat4 &matrix)
{
    glUniformMatrix4fv(GetLocationOfUniform(name), 1, GL_FALSE, &matrix[0][0]);
}
```

Now, the shader class is finished, let's see the definition of `shader.h':

```c++
struct ShaderProgram
{
    std::string vertex;
    std::string fragment;
};

class Shader
{
private:
    unsigned int renderID;
    std::string filePath;
    std::unordered_map<std::string, int> m_uniformLocationMap;

public:
    Shader(std::string path);
    ~Shader();

    void Bind() const;
    void UnBind() const;

    void SetUniform4f(const std::string &name, float v0, float v1, float f0, float f1);
    void SetUniform1i(const std::string &name, int value);
    void SetUniform1f(const std::string &name, float value);
    void SetUniformMat4f(const std::string &name, const glm::mat4& matrix);
    int GetLocationOfUniform(const std::string &name);
private:
    unsigned int CompileShader(unsigned int type, std::string &source);
    unsigned int CreateShader(std::string &vertextShader, std::string &fragmentShader);
    ShaderProgram ParseShader();
};
```

### Texture

In OpenGL, using textures typically involves the following steps:

1. **Load Texture Image**: First, you need to load the texture image from a file into memory. This is usually done using an external library (like `stb_image.h` or SOIL) because OpenGL does not provide image loading capabilities by itself.
2. **Generate Texture Object**: Use the `glGenTextures` function to generate a texture object.
3. **Bind Texture Object**: Use the `glBindTexture` function to bind the texture object so that OpenGL knows the subsequent texture instructions are for this texture. You can bind different types of textures with this function, such as 2D textures (`GL_TEXTURE_2D`).
4. **Set Texture Parameters**: Use the `glTexParameteri` or `glTexParameterf` function to set various texture parameters, such as texture wrapping mode (`GL_TEXTURE_WRAP_S`, `GL_TEXTURE_WRAP_T`), texture filtering mode (`GL_TEXTURE_MIN_FILTER`, `GL_TEXTURE_MAG_FILTER`), etc.
5. **Upload Texture to GPU**: Use the `glTexImage2D` function to upload the texture data to the GPU. This function sets the texture's format and size, as well as the format and data type of the texture image.
6. **Generate Mipmap (Optional)**: If you plan to use Mipmaps (a texture scaling technique), you can call the `glGenerateMipmap` function to generate Mipmaps for the texture.
7. **Use Texture in Shader**: In the GLSL shader program, you need to declare a uniform sampler (`sampler2D` for 2D textures) to access the texture. Use the `glUniform1i` function to pass the texture unit location to the shader.
8. **Activate Texture Unit**: Before drawing, use the `glActiveTexture` function to activate a specific texture unit and then bind the corresponding texture to this unit.
9. **Cleanup**: When the texture is no longer needed, use the `glDeleteTextures` function to delete the texture object and free up resources.

 `Texture.h` is easier, we can just implement these functions above in `constructor`. Show code:

```c++
class Texture
{
private:
    unsigned int textureID;
    std::string filePath;
    unsigned char *m_LocalBuffer;
    int m_Width, m_Height, m_BPP;

public:
    Texture(const std::string& path);
    ~Texture();

    void Bind(unsigned int slot = 0) const;
    void UnBind() const;

    inline int GetWidth() const {return m_Width;}
    inline int GetHeight() const {return m_Height;}
};


Texture::Texture(const std::string &path) : textureID(0), filePath(path), m_LocalBuffer(nullptr), m_Width(0), m_Height(0), m_BPP(0)
{
    stbi_set_flip_vertically_on_load(1);                                     // flip our texture, make it up side down
    m_LocalBuffer = stbi_load(path.c_str(), &m_Width, &m_Height, &m_BPP, 4); // m_BPP 是每个像素的位数
    // generate a texture id
    glGenTextures(1, &textureID);
    glBindTexture(GL_TEXTURE_2D, textureID);
    // set parameters
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);
    // submit Image data to GPU
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA8, m_Width, m_Height, 0, GL_RGBA, GL_UNSIGNED_BYTE, m_LocalBuffer);
    // clear it after all
    glBindTexture(GL_TEXTURE_2D, 0);
    if (m_LocalBuffer)
    {
        stbi_image_free(m_LocalBuffer);
    }
}

Texture::~Texture()
{
    glDeleteTextures(1, &textureID);
}

void Texture::Bind(unsigned int slot) const
{
    glActiveTexture(GL_TEXTURE0 + slot);
    glBindTexture(GL_TEXTURE_2D, textureID);
}

void Texture::UnBind() const
{
    glBindTexture(GL_TEXTURE_2D, 0);
}
```

## Math in OpenGL

In CG, in order to render a graphic , we always need to translate object's position, or translate their coordinate system, so in CG, there is somrthing called MVP matrix, MVP matrix is multiply by three matrixes, which is model * view * projection. In order to process matrix multiple, we need to import a library, which is called glm.

First we can define there base matrix we want：

```c++
// here we define projection model as orthogonal
glm::mat4 proj = glm::ortho(0.0f, 960.0f, 0.0f, 540.0f, -1.0f, 1.0f);
glm::mat4 view = glm::translate(glm::mat4(1.0f), glm::vec3(-100, 0, 0));
glm::mat4 model = glm::translate(glm::mat4(1.0f), translateA);
```

then multiple them:

```c++
glm::mat4 mvp = proj * view * model;
```

Of course, we need to convey this mvp matrix to gpu, we need to define a uniform to accept data in shader:

```glsl
#Shader vertex
#version 330 core

layout(location=0) in vec4 position;
layout(location=1) in vec2 texCoord;

out vec2 v_TexCoord;
uniform mat4 u_MVP; // I'm here!

void main()
{
    gl_Position = u_MVP * position;
    v_TexCoord = texCoord;
}
```

Then convey data:

```c++
shader.SetUniformMat4f("u_MVP", mvp);
```

Here is the whole code:

```c++
{
    glm::mat4 model = glm::translate(glm::mat4(1.0f), translateA);
    glm::mat4 mvp = proj * view * model;
    shader.SetUniformMat4f("u_MVP", mvp);
    renderer.Draw(va, indexBuffer, shader);
}
```

## Batch Render

### what is Batch Rendering

Batch rendering is a technique used in computer graphics to minimize the number of rendering calls made to the graphics API (like OpenGL or DirectX) and, as a result, improve the performance of a graphics application, especially when rendering a large number of objects. The idea is to combine many smaller draw calls into a larger, single draw call. This is particularly effective because making a draw call is a relatively expensive operation due to the state changes and communication overhead between the CPU and GPU.

### How Batch Rendering Works

Instead of rendering each object individually with its own draw call, batch rendering involves grouping multiple objects that share similar properties, such as textures, shaders, or vertex data, and then rendering them all at once. Here’s a simplified overview of how it works:

1. **Collecting Objects**: Determine which objects can be rendered together based on their properties. For example, all objects using the same texture and shader program can be grouped into a single batch.
2. **Creating a Batch**: Combine the vertex data (and possibly index data) of all the objects in the batch into a single set of buffers. This usually involves appending the data of each object into a large vertex buffer and index buffer.
3. **Uploading Data**: The combined data is uploaded to the GPU memory once, reducing the number of state changes and data transfers between the CPU and GPU.
4. **Rendering**: Issue a single draw call to the GPU to render the entire batch of objects. The GPU then renders all objects in the batch in one go, which is much faster than rendering each object with a separate draw call.

### Batch Rendering in Color

Batch rendering in different colour is easy, the main thing we need to put two groups of data in one vertex buffer. For example, now we have two quads with different colors:

```c++
float vertices_1[] = {
    // 第一个四边形的位置     // 颜色
    -0.5f,  0.5f, 0.0f,   1.0f, 0.0f, 0.0f, // 左上
    -0.5f, -0.5f, 0.0f,   1.0f, 0.0f, 0.0f, // 左下
     0.5f, -0.5f, 0.0f,   1.0f, 0.0f, 0.0f, // 右下
     0.5f,  0.5f, 0.0f,   1.0f, 0.0f, 0.0f
}
```

```c++
float vertices_2[] = {
    // 第二个四边形的位置     // 颜色
    -0.25f,  0.25f, 0.0f,  0.0f, 1.0f, 0.0f, // 左上
    -0.25f, -0.75f, 0.0f,  0.0f, 1.0f, 0.0f, // 左下
     0.75f, -0.75f, 0.0f,  0.0f, 1.0f, 0.0f, // 右下
     0.75f,  0.25f, 0.0f,  0.0f, 1.0f, 0.0f  // 右上
}
```

In order to reduce draw call to one, we can combine these two vertex arrays:

```c++
float vertices[] = {
    // 第一个四边形的位置     // 颜色
    -0.5f,  0.5f, 0.0f,   1.0f, 0.0f, 0.0f, // 左上
    -0.5f, -0.5f, 0.0f,   1.0f, 0.0f, 0.0f, // 左下
     0.5f, -0.5f, 0.0f,   1.0f, 0.0f, 0.0f, // 右下
     0.5f,  0.5f, 0.0f,   1.0f, 0.0f, 0.0f, // 右上

    // 第二个四边形的位置     // 颜色
    -0.25f,  0.25f, 0.0f,  0.0f, 1.0f, 0.0f, // 左上
    -0.25f, -0.75f, 0.0f,  0.0f, 1.0f, 0.0f, // 左下
     0.75f, -0.75f, 0.0f,  0.0f, 1.0f, 0.0f, // 右下
     0.75f,  0.25f, 0.0f,  0.0f, 1.0f, 0.0f  // 右上
};

unsigned int indices[] = {
    0, 1, 3, // 第一个四边形的第一个三角形
    1, 2, 3, // 第一个四边形的第二个三角形
    4, 5, 7, // 第二个四边形的第一个三角形
    5, 6, 7  // 第二个四边形的第二个三角形
};

// 顶点位置属性
glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(float), (void*)0);
glEnableVertexAttribArray(0);
// 顶点颜色属性 Add a new vertex properties
glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(float), (void*)(3 * sizeof(float)));
glEnableVertexAttribArray(1);
```

### Batch Rendering in Texture

##### Step 1: Shader Setup

First, let's set up the shaders to support multi-texturing. Your fragment shader needs to be able to sample from two different texture units.

```glsl
#version 330 core
out vec4 FragColor;

in vec2 TexCoords;

uniform sampler2D texture1;
uniform sampler2D texture2;

void main() {
    FragColor = mix(texture(texture1, TexCoords), texture(texture2, TexCoords), 0.5);
}
```

This shader mixes the colors from two textures using a 50/50 mix.

##### Step 2: Preparing Texture Data

Ensure you have two textures loaded and bound to different texture units. Here's a simplified way to load and bind textures to two texture units:

```cpp
// Load textures
unsigned int texture1, texture2;
glGenTextures(1, &texture1);
glBindTexture(GL_TEXTURE_2D, texture1);

glGenTextures(2, &texture2);
glBindTexture(GL_TEXTURE_2D, texture2);

// Activate the first texture unit before binding texture
glActiveTexture(GL_TEXTURE0);
glBindTexture(GL_TEXTURE_2D, texture1);

// Activate the second texture unit before binding texture
glActiveTexture(GL_TEXTURE1);
glBindTexture(GL_TEXTURE_2D, texture2);
```

##### Step 3: Vertex Data and Attribute Pointers

You'll need a vertex array object (VAO), vertex buffer object (VBO), and optionally an element buffer object (EBO) for the indices. Here's an example of setting those up for two quads:

```cpp
float vertices[] = {
    // positions    // texture coords
    0.5f,  0.5f, 0.0f,   1.0f, 1.0f, // top right
    0.5f, -0.5f, 0.0f,   1.0f, 0.0f, // bottom right
    -0.5f, -0.5f, 0.0f,  0.0f, 0.0f, // bottom left
    -0.5f,  0.5f, 0.0f,  0.0f, 1.0f  // top left 
};

unsigned int indices[] = {  
    0, 1, 3, // first triangle
    1, 2, 3  // second triangle
};

unsigned int VBO, VAO, EBO;
glGenVertexArrays(1, &VAO);
glGenBuffers(1, &VBO);
glGenBuffers(1, &EBO);
// Bind and set VBO and EBO...
```

##### Step 4: Linking Vertex Attributes

Bind the vertex array object (VAO) and set vertex attribute pointers:

```cpp
glBindVertexArray(VAO);

glBindBuffer(GL_ARRAY_BUFFER, VBO);
glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

// Position attribute
glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)0);
glEnableVertexAttribArray(0);
// Texture coord attribute
glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 5 * sizeof(float), (void*)(3 * sizeof(float)));
glEnableVertexAttribArray(1);
```

##### Step 5: Drawing

In your rendering loop, activate the shader and draw the quads:

```cpp
glUseProgram(shaderProgram);
// set the sampler to the correct texture unit
glUniform1i(glGetUniformLocation(shaderProgram, "texture1"), 0);
glUniform1i(glGetUniformLocation(shaderProgram, "texture2"), 1);

glBindVertexArray(VAO);
glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
```

This approach uses a single VAO to store the quad's vertex attributes and EBO for indices, allowing us to draw two textured quads in one draw call. The key here is using two texture units and sampling from both in the fragment shader, blending their output. Depending on your specific needs, you might adjust the mixing ratio or use more sophisticated shaders for different effects.

### Dynamic Batching

In the above code, we combine vertex data into one array, but this is still static, if we want to make it dynamic, we can define a struct, for example, we have the vertex array:

```c++
float vertices[] = {
    // 第一个四边形的位置     // 颜色					 			// texture coordinate
    -0.5f,  0.5f, 0.0f,   1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 1.0f,
    -0.5f, -0.5f, 0.0f,   1.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f,
     0.5f, -0.5f, 0.0f,   1.0f, 0.0f, 0.0f, 1.0f, 0.0f, 0.0f,
     0.5f,  0.5f, 0.0f,   1.0f, 0.0f, 0.0f, 1,0f, 0.0f, 1.0f
};
```

Here we have three attributes: position, color and coordinate, so can define a struct:

```c++
struct vertice{
	float position[3];
	float color[4];
	float coordinate[2];
}
```

then add to buffer:

```c++
glBufferData(GL_ARRAY_BUFFER, vertices.size() * sizeof(float), vertices.data(), GL_DYNAMIC_DRAW);
```

But we don't need to change index buffer, we just use loop to use indices array.

```c++
unsigned int indices[] = {
  0, 1, 2,
  2, 3, 0
};
```
