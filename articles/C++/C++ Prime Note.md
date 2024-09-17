## Variable & Basic Type

### Variable Size

| type              | size                                                         |
| ----------------- | ------------------------------------------------------------ |
| bool              | 8bits                                                        |
| char              | 8bits                                                        |
| wchar_t           | 16bits                                                       |
| char16_t(unicode) | 16bits                                                       |
| char32_t(unicode) | 32bits                                                       |
| short             | 16bits                                                       |
| int               | 16bits                                                       |
| long              | 32bits                                                       |
| long long         | 64bits                                                       |
| float             | 32bits, 6 significant figures, like 123.456, 0.00123456, 123456 |
| double            | 64bits, 10 significant figures                               |
| long double       | 64 bits, 10 significant figures                              |

1. if we know the varible is non-negative, choose unsign type
2. using `int` for integer calculation, mostly, the size of `long` is same as `int`, if the size is larger than `int`, choose `long long`
3. double and float:
   1. float is 4 bytes, double is 8 bytes, so `double` offers higher precision than `float`
   2. Mordern processor are optimized for `double`, so they are not  usually slower than `float`
   3. In most case, using `double`, but in game development, graphic processing, using `float` since precision requirement is lower in these cases.

```
(a) 'a', L'a', "a", L"a"
(b) 10, 10u, 10L, 10uL, 012, 0xC
(c) 3.14, 3.14f, 3.14L
(d) 10, 10u, 10., 10e-2
```

a. Character literal value, wide character literal value, string literal value, wide string literal value
b. decimal integer, unsigned decimal integer, long decimal integer, unsigned decimal integer, octal integer, hexadecimal integer
c. Double, float, long double
d. Decimal integer, unsigned decimal integer, double, double

### Variable Define & declaration

1. Initialization is not assignment
2. assignment = clear initial value + give new value
3. initial list: `int units_sold{0}`
4. you can multiple declaration a variable but you only can define it once, declare a variable: `extern int i`

### Reference

A reference is essentially an alias for another object. When you create a reference to a variable, you are creating a new name that refers to the same memory location as the original variable.

```c++
int val = 42;
int &refVal = val; 	// refVal is now a reference to val
```

reference must be initialized at decelaration.

#### Binding

- Once a reference is initialized to an object, it becomes bound to that object. This means that the reference will always refer to the same object for its entire lifetime.

- You cannot rebind a reference to refer to another object after it has been initialized.

- Example:

  ```c++
  cpp复制代码int a = 5;
  int b = 10;
  int &refA = a; // refA is now bound to a
  refA = b; // This does not rebind refA to b; it assigns the value of b to a
  ```

### Pointer

Pointer is a value which stores the address of the variable.

Get variable address:
```c++
int i = 42;
int *p = &i;
```

output an object: `cout << *p` , `*` is used to dereference

Empty pointer doesn't point to any objects, int *p = nullptr.

pointer `void*` can store any objects' address, that is non-type pointer, it only process memory space, can't access the object, so it need to cast a specific type pointer.

### Const

### Top-level & Low-level

Top-level const means the variable is const itself, low-level const means the pointer points a const variable

```c++
const int v2 = 0; int v1 = v2;
int *p1 = &v1, &r1 = v1;
const int *p2 = &v2, *const p3 = &i, &r2 = v2;
```

V2 is top-level const, p2 is low-level, p3 is both top-level and low-level(since p3 is a const pointer and it points to a const variable), r2 is low-level.

#### initialization

- const object must need to be initialized, and can't be changed
- const variable can't be accessed in another script, if you want to do that, add `extern`\
- reference to const can be read but cann't be changed
-  pointer to const: can't change the value of the object be pointed. (top-level const)
  `const double pi = 3.14; const double *cptr = &pi`
- const pointer: the address of the object can't be changed, but the value of the object can be changed (low-level const)
  `int i = 0; int *const ptr = &i`
- for top-level const, copy won't influence that, but for low-level const, we need add const by ourselves.
- constexpr: the object can be know at compile step

### Type Processing

`using` for alias, `using SI = Sales_item`

#### decltype

`decltype` can infer type from an expression

```c++
int a = 0;
decltype(a) b = 5;	// type of is int, since a is int
```

```c++
int f() {return 42;}
decltype(f()) sum = 10; // type of sum is int, since f() returns int
```

**decltype won't ignore top-level const, if the expression in decltype contains const, the infer type also contains const**

```c++
int i = 0;
decltype((i)) j = i; // type of j is int&，since (i) is lvalue expression
```

```c++
int x = 0;
int y = 0;
decltype(x = y) z = x; // type of z is int&，since x = y is a lvalue expression
```

in real working life, `decltype` often used for **Generic programming**, **template programming**, and **type inference**

```c++
template <typename T, typename U>
auto add(T t, U u) -> decltype(t + u) {
    return t + u;
}
```

### Preprocessor

```c++
#ifndef SALES_DATA_H  //SALES_DATA_H未定义时为真
#define SALES_DATA_H
strct Sale_data{
    ...
}
#endif
```

## String, Vector & Array

### Using 

- using namespace
- don't use "using" in the head file, since other code uses this head file will use this "using" meantime.

### String

A string is a variable-length character sequence.

Copy Initialization: using `=` copy an existing object to another
Direct Initialization: using `()` assign value to object

for (auto c : str) or for (auto &c : str)

### Vector

Vector is a template 

| Method                    | Explain                                                      |
| ------------------------- | ------------------------------------------------------------ |
| vector<T> v1              | v1 is a empty vector, the potential element is T type, excute default initialization |
| vector<T> v2 = v1         | v2 contains all elements in v1                               |
| vector<T> v2(v1)          | same as vector<T> v2=v1                                      |
| vector<T> v3(n, val)      | v3 contains duplicate elements, each one is val              |
| vector<T> v4(n)           | v4 contains duplicate elements which are initialized         |
| vector<T> v5{a, b, c...}  | v5 contains several initialized value                        |
| vector<T> v5={a, b, c...} | same as vector<T> v5{a, b, c...}                             |

C++11, vector<string> initialize: vector<string> v{"a", "an", "the"};

#### Add Elements

push_back()
push_back() may cause memory allocation(when there are no enough space), and call copy constructor. So it's better to use `Reserve()` allocating some memory space previously.

Notice thread security.

### Iterator

iterator can traverse a container.

- `auto b = v.begin();` returns an iterator pointing to the first element.
- `auto e = v.end();` returns an iterator pointing to the element past the last one (sentinel, past-the-end, one past the end) (off the end).
- If the container is empty, `begin()` and `end()` return the same iterator, which is the past-the-end iterator. 
- Use the dereference operator `*` to access the element pointed to by the iterator. Make a habit of using iterators and `!=` (for generic programming).
- `const_iterator`: can only read elements in the container but cannot modify them. 
- Arrow operator: dereference + member access, `it->mem` is equivalent to `(*it).mem`. 

**whenever a loop uses iterators, do not add elements to the container that the iterator belongs to.**

### C style string

Using stl string is better than this in most of time

### Pointer VS Reference

1. Reference always points to one of object
2. if the reference is not initialized, it would be wrong

### Pointer to pointer

a pointer to a pointer is a variable that stores the address of another pointer.

#### Declaration and Usage

```c++
int x = 5;
int *p = &x;    // Pointer to int
int **pp = &p;  // Pointer to pointer to int
```

#### Use Case

```c++
#include <iostream>
using namespace std;

void allocateMemory(int **p) {
    *p = new int;  // Allocates memory for an integer
    **p = 100;     // Sets the value to 100
}

int main() {
    int *p = nullptr;
    allocateMemory(&p);

    if (p != nullptr) {
        cout << "Value of allocated memory: " << *p << endl; // Output: 100
        delete p; // Free the allocated memory
    }

    return 0;
}
```

Multidimensional arrays

```c++
#include <iostream>
using namespace std;

int main() {
    int rows = 3;
    int cols = 4;

    // Allocate memory for a 2D array
    int **matrix = new int*[rows];
    for (int i = 0; i < rows; ++i) {
        matrix[i] = new int[cols];
    }

    // Initialize and print the matrix
    for (int i = 0; i < rows; ++i) {
        for (int j = 0; j < cols; ++j) {
            matrix[i][j] = i * cols + j;
            cout << matrix[i][j] << " ";
        }
        cout << endl;
    }

    // Deallocate memory
    for (int i = 0; i < rows; ++i) {
        delete[] matrix[i];
    }
    delete[] matrix;

    return 0;
}
```

### Dynamic Array

- using `new` and `delete` , allocate in the heap
- int *pia = new int[10];
- delete [ ] pia;

## Expression

### Lvalue & Rvalue

The left value refers to an expression that can appear on the left of the assignment operator, indicating a memory position that can obtain the value of the location or store the new value in the  position.
	1. Addressable
	1. Durability: It exist with its scope and will not disappear because of the end of the expression

The right value can't appear on the left of the assignment operator, it represents a temporary value or literal quantity.
	1. non-addressable
	1. temporary

### Arithmetic operator

**overflow**: when calculation result exceeds the range of the type, it can overflow
**remainder operation**: m%n, the symbol of the result same as the m

### Short-circuit evaluation

it conditionally decides if need to calculate right-hand operand, accordfing to the value of the left-hand operand.
like `&&` , it calculate right-hand operand only when left operand is true.

using reference can avoid copy for element:
```c++
vector<string> text;
for(const auto &s: text){
  cout<<s;
}
```

### Incremental decrement operator

++i and i++，priority use ++i, i++ will store original value

*iter++ euqals to *(iter++), incremental operator has higher priority.

### Member access operaor

ptr->mem equals to (*ptr).mem, `.` has higher operator than `*`, so remember adding `( )` 

### Bitwise  operator

The bit operator acts on an integer type.
`<<`: move to left
`>>`: move to right
`~`: inverse
`&`: and
`|`: or
`^`: XOR

### Implicit type conversion

This is known as automatic type conversion or type promotion, refers to  the process where the compiler automatically converts a value from one data type to another without explicit instruction.

1. **Avoid precision loss**
   Implicit type conversion is designed to avoid precision loss whenever possible. This means that values are usually converted to a more precise or higher precision type.

   ```c++
   int i = 42;
   double d = i; // int is converted to double, avoiding precision loss
   ```

2. **Promotion of integers smaller than int**
   During calculations, integer types smaller than `int` (such as `char` and `short`) are promoted to `int` or `unsigned int` to prevent overflow or precision loss.

   ```c++
   char c = 'A';
   int i = c + 1; // char is promoted to int for arithmetic operations
   ```

3. **Non-boolean types in conditional statements**
   In conditional statements, non-Boolean types are implicitly converted to Boolean types. Non-zero values are converted to `true`, while zero values are converted to `false`.

   ```c++
   int x = 10;
   if (x) {
       // x is implicitly converted to a Boolean true
   }
   ```

4. **Type conversion in Arithmetic or Relational Operations**
   In arithmetic or relational operations, if the operands have different types, they are converted to the same type for the calculation. Typically, they are converted to the type with the highest precision in the expression.

   ```c++
   int a = 5;
   double b = 6.7;
   double result = a + b; // int is converted to double, then the addition is performed
   ```

5. Type conversion in Function calls
   During function calls, the actual parameter's type is converted to the type of the function parameter.

   ```c++
   void func(double d) {
       // ...
   }
   
   int i = 42;
   func(i); // int is converted to double
   ```

## Statements

### Try-Catch

`try` statement start with keyword `try`, which follow by several `catch`, is there are any exception in try scope, the control flow will jump to first matching `catch`

```c++
try {
    // 可能抛出异常的代码
    func();
} catch (const std::runtime_error& e) {
    // 异常处理代码
    std::cerr << "Caught an error: " << e.what() << std::endl;
} catch (const std::exception& e) {
    // 捕获其他std::exception的子类
    std::cerr << "Caught an exception: " << e.what() << std::endl;
}
```

### Abnormal  Class

```c++
class MyException : public std::exception {
public:
    const char* what() const noexcept override {
        return "My custom exception";
    }
};

void func() {
    throw MyException();
}

try {
    func();
} catch (const MyException& e) {
    std::cerr << "Caught MyException: " << e.what() << std::endl;
}
```

## Function

**return type: **void means the func return nothing, the return type of the function can't be an array or function, but can be a pointer pointing to an array or a function.

```c++
int* getArray() {
    static int arr[10];
    // Initialize array
    for (int i = 0; i < 10; ++i) {
        arr[i] = i;
    }
    return arr; // return the pointer to array
}
```

```c++
int add(int a, int b) {
    return a + b;
}

int (*getFunction())(int, int) {
    return add; //  return the pointer to func
}
```

### local static variable

The local static variable is decalared within a function, it is decalared only once, and the lifecycle runs through the program's runtime, it still exists after the function exits. **But the scope is wtill limited with the function, other function can't access local static variable directly.**

### Const formal and actual parameters

- The top-level const of formal parameter can be ignored, `void func(const int i);` can both pass `const int` and `int` into function

- It is possible to initialize an low-level const object with a non constant, but the opposite is not possible
  ```c++
  int x = 10;
  const int* p = &x; // it's ok, low-level const
  
  const int y = 20;
  int* q = &y; // error, don't allow constant to initialize non-const pointer
  ```

- In the function, the local copy of the real parameter cannot be changed
  ```c++
  void modifyValue(int i) {
      i = 20; 
  }
  
  int main() {
      int a = 10;
      modifyValue(a);
      std::cout << a << std::endl;
      return 0;
  }
  ```

- Try to use constant reference
  Using constant references (const&) can avoid copying and prevent modifying incoming objects within the function, improving code efficiency and security.

  ```c++
  void printValue(const int& i) {
      std::cout << i << std::endl;
  }
  
  int main() {
      int a = 10;
      printValue(a); // 传入int类型
      const int b = 20;
      printValue(b); // 传入const int类型
      return 0;
  }
  ```

  #### main function

  `int main(int argc, char *argv[]){...}` first parameter depresent the number of the para, the second parameter depresent c-style string array.

### Initializer_list

The initializer_list is a type of class template in c++ standard library, it indicates a type of constant array. It always used to enable function can accept a variable number of parameters of the same type. 
for example:

```c++
#include <initializer_list>
#include <iostream>

void printList(std::initializer_list<int> list) {
    for (auto elem : list) {
        std::cout << elem << " ";
    }
    std::cout << std::endl;
}

int main() {
    printList({1, 2, 3, 4, 5}); 
    return 0;
}
```

Different with `std::list`

`std::list`:

1. it is a two -way linked list, efficient for insert and delete element
2. use for frequently delete, insert and do not care about the scene of random access performance
3. memory alloc in heap, dynamic allocation of memory

`std::initializer_list`:

1. Used for initialize a container or pass a variable number of parameters of the same type in a function
2. Used for initialized list and function parameter
3. readonly, used for constant array, lifecycle is short. 
4. it is allocated in the stack

### Return Type & Return Statement

- The return value of the return statement must be of the same type as the function's return type, or be able to be implicitly converted to the function's return type.
- Return of value: The value returned is used to initialize a temporary quantity at the point of call that is the result of the function call.
- **Do not return references or pointers to local objects.**
- References return left values: The return type of a function determines whether the function call is left-valued. Calling a function that returns a reference gets the left value; other return types get the right value.
- List initialized return values: a function can return a list of values surrounded by curly braces. (C++11)
- Return value of main function main: if there is no return at the end, the compiler will implicitly insert a return statement that returns 0. A return of 0 means successful execution.

### Overload

**overload:** If there are several functions which names are same but the list of the formula parameter are different, these functions are overload

main function can't be overload

overload and const formula parameter:

1. one formula parameter has top-level const can't differ with the function without top-level const:
   `Record lookup(Phone* const)` and `Record lookup(Phone*)` are same
2. in contrast, whether function has low-level const can be  distinguished.
   `Record lookup(Account*)`and `Record lookup(const Account*)` are different.

**overload and scope**: different scope can't overload.

### Inline Function

Inline function can expand function body at the call point, it can improve efficient. The idea of inline function is replace function calling with function code, then reduce calling cost.
```c++
inline int add(int a, int b) {
    return a + b;
}

int main() {
    int result = add(3, 4); // int result = 3 + 4;
    return 0;
}
```

**Applicable Scenarios:** Small, frequently called functions: suitable for defining small, simple, frequently called functions, such as accessor methods, simple calculation functions, etc.
Avoid recursion and complex logic: inline functions are not suitable for functions that contain recursive calls or complex logic.

### Assert Preprocessing macros

`assert(expr)`, if `expr` is false, the program will be paused, and print error info.

 By defining or undefined NDEBUG macros, assertion checking can be turned on or off

```c++
#include <iostream>
#include <cassert>

using namespace std;

void testFunction(int value) {
    assert(value > 0); // assert check

    #ifndef NDEBUG
        cerr << __func__ << " called with value: " << value << endl;
    #endif
}

int main() {
    testFunction(5);  //debug info: func name and para value
    testFunction(-1); //assert called, program paused
    return 0;
}
```

### Function Pointer

Function pointer: is a pointer to a function.

- `bool (*pf)(const string &, const string &); ` Note: The parentheses at both ends must not be missing.

  ```c++
  #include <iostream>
  #include <string>
  
  bool compare(const std::string &a, const std::string &b) {
      return a == b;
  }
  
  int main() {
      bool (*pf)(const std::string &, const std::string &) = compare;
      std::string str1 = "hello";
      std::string str2 = "world";
      
      if (pf(str1, str2)) {
          std::cout << "Strings are equal." << std::endl;
      } else {
          std::cout << "Strings are not equal." << std::endl;
      }
      return 0;
  }
  ```

  

- Function pointer as formal parameter, the following two are same
  **Using Function Pointer as Parameter:**

  ```c++
  void useFunctionPointer(bool (*pf)(const std::string &, const std::string &)) {
      std::string str1 = "hello";
      std::string str2 = "hello";
      if (pf(str1, str2)) {
          std::cout << "Strings are equal." << std::endl;
      } else {
          std::cout << "Strings are not equal." << std::endl;
      }
  }
  ```

  **Using Function Definition as Parameter:**

  ```c++
  void useFunctionPointer(bool compare(const std::string &, const std::string &)) {
      std::string str1 = "hello";
      std::string str2 = "hello";
      if (compare(str1, str2)) {
          std::cout << "Strings are equal." << std::endl;
      } else {
          std::cout << "Strings are not equal." << std::endl;
      }
  }
  ```

- Use type aliases or decltype.
  **type aliases:**

  ```c++
  typedef bool (*CompareFunc)(const std::string &, const std::string &);
  
  void useFunctionPointer(CompareFunc pf) {
      std::string str1 = "hello";
      std::string str2 = "hello";
      if (pf(str1, str2)) {
          std::cout << "Strings are equal." << std::endl;
      } else {
          std::cout << "Strings are not equal." << std::endl;
      }
  }
  ```

  **decltype:**

  ```c++
  void useFunctionPointer(decltype(compare) *pf) {
      std::string str1 = "hello";
      std::string str2 = "hello";
      if (pf(str1, str2)) {
          std::cout << "Strings are equal." << std::endl;
      } else {
          std::cout << "Strings are not equal." << std::endl;
      }
  }
  ```

- Returns a pointer to a function: 1. type alias; 2. trailing return type.
  using type alias:

  ```c++
  typedef bool (*CompareFunc)(const std::string &, const std::string &);
  
  CompareFunc getCompareFunc() {
      return compare;
  }
  ```

  using trailing return type
  ```c++
  auto getCompareFunc() -> bool (*)(const std::string &, const std::string &) {
      return compare;
  }
  ```

  #### Complete Example

  ```c++
  #include <iostream>
  #include <string>
  
  bool compare(const std::string &a, const std::string &b) {
      return a == b;
  }
  
  typedef bool (*CompareFunc)(const std::string &, const std::string &);
  
  void useFunctionPointer(CompareFunc pf) {
      std::string str1 = "hello";
      std::string str2 = "hello";
      if (pf(str1, str2)) {
          std::cout << "Strings are equal." << std::endl;
      } else {
          std::cout << "Strings are not equal." << std::endl;
      }
  }
  
  auto getCompareFunc() -> bool (*)(const std::string &, const std::string &) {
      return compare;
  }
  
  int main() {
      CompareFunc pf = getCompareFunc();
      useFunctionPointer(pf);
      return 0;
  }
  ```

## Class

### *this

- each member has an extra, implicit parameter this
- this pointer points to current object, it is a const pointer
- The const following the formal parameter table changes the type of the implicit this formal parameter, e.g., bool same_isbn(const Sales_item &rhs) const, which is called a “constant member function” (the current object pointed to by this is a constant).
- return `*this;` can allow member functions to be called continuously.
- Ordinary non -Const member function: This is a const pointer to the type type (it can change the value that this is pointed to and cannot change the address saved by this).
- Const member function: This refers to the Const pointer to the Const class (neither can change the value of this direction or the address saved by this.)

### delegating constructor

A delegating constructor calls another constructor in the same class to perform part or all of its initialization. This is particularly useful for avoiding code duplication when multiple constructors share common initialization steps.
```c++
#include <iostream>

class MyClass {
public:
    MyClass() : MyClass(0) { // Delegating constructor
        std::cout << "Default constructor\n";
    }

    MyClass(int value) : value_(value) {
        std::cout << "Parameterized constructor with value: " << value_ << "\n";
    }

private:
    int value_;
};

int main() {
    MyClass obj1;       // Calls default constructor, which delegates to the parameterized constructor
    MyClass obj2(10);   // Calls parameterized constructor directly
    return 0;
}

```

```c++
output:
Parameterized constructor with value: 0
Default constructor
Parameterized constructor with value: 10
```

### Converting Constructor

A converting constructor is a constructor that can be called with a single argument, allowing implicit conversion from the argument type to the class type.

**Single step conversion:** The compiler will automatically perform only a single-step type conversion. This means it won't chain multiple conversions to achieve the desired type.

```c++
class MyClass {
public:
    MyClass(double value) {
        // Initialization
    }
};

int main() {
    double d = 3.14;
    MyClass obj = d; // Implicit conversion from double to MyClass
    return 0;
}
```

Using `explicit` can supress implicit conversion 
```c++
class MyClass {
public:
    explicit MyClass(int value) : value_(value) {
        // Initialization
    }

private:
    int value_;
};

int main() {
    MyClass obj1(42); // Direct initialization is allowed
    // MyClass obj2 = 42; // Error: Implicit conversion is not allowed
    return 0;
}
```

### Aggregate Class

An aggregate class in C++ is a class or struct that meets the following criteria:

1. All member are public
2. Non User-Defined Constructors
3. No In-Class Initializers
4. No Base classes or virtual functions

that is a data structure, like:
```c++
struct Point {
    int x;
    int y;
};
```

```c++
int main() {
    Point p1 = {10, 20};  // Aggregate initialization
    std::cout << "Point: (" << p1.x << ", " << p1.y << ")\n";
    return 0;
}
```

### Static

- Non-static data members exist in every object of the class type.
- A static data member exists independently of any object of that class.
- Each static data member is an object associated with the class and is not associated with an object of that class.
- Declaration:
  - The declaration is preceded by the keyword static.
- Usage:
  - Use the scope operator ::Direct access to static members: r = Account::rate();
  - Can also be accessed using the object: r = ac.rate();
- Definitions:
  - No need to add static when defining outside the class.
- Initialization:
  - **Usually not initialized inside the class, but initialized at definition time, e.g. `double Account::interestRate = initRate();` **
  - **If it must be defined inside the class, the requirement is that it must be a constexpr of type literal value constant.**

