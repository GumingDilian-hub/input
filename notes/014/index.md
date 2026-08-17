# 生物信息学附录
## 附录1：科学上网

使用fCLASH（x）/hiddify进行科学上网，由于这玩意可能违法，我不多说

fCLASHx下载：github.com/chen08209/FlClash/releases

fCLASHx使用：github.com/clashbk/clash/wiki/clashx

hiddify官网：hiddify.com

hiddify有还不错的免费节点，而CLASH需要自己从“机场”买节点，推荐扬帆云

这里最难的一步是别乱传，别天天就往社交平台发布外网信息，使用这个的目的是使用更强劲的ChatGPT和Gemini（Claude暂时无法使用）以及访问被封禁的NCBI和Wikipedia维基百科，耗子尾汁吧
## 附录 2

### 第一课：Python 绝对零基础（从打开终端到写出第一个判断）

本课目标：

- 知道什么是 Python 解释器

- 能写出 `input()` 和 `if`

- 掌握最常见的 6 种数据类型及其转换

- 会用 `for` 和 `while` 做重复任务

- 能定义自己的简单函数

---

#### 1. 运行 Python 的两种方式（只讲操作）

| 方式 | 命令 | 适用场景 |
|------|------|----------|
| 交互式（REPL） | 终端输入 `python` 或 `python3`，然后直接写代码，回车即执行 | 测试小片段 |
| 脚本文件 | 创建 `xxx.py`，写入代码，终端执行 `python xxx.py` | 写完整程序 |

你的第一个脚本（创建 `hello.py`）：

```python
print("Hello world")
```

终端运行：

```bash
python hello.py
```

---

#### 2. 变量与赋值（记住：右边先算，再给左边）

```python
x = 5          # 整数
y = 3.14       # 浮点数
name = "Zhang" # 字符串
is_student = True  # 布尔值（True/False）
```

变量命名规则：字母、数字、下划线组成，不能数字开头，大小写敏感。

---

#### 3. 最常用的 6 种数据类型（表格）

| 类型名 | 中文 | 写法示例 | 用途 |
|--------|------|----------|------|
| `int` | 整数 | `10`, `-3`, `0` | 计数、索引 |
| `float` | 浮点数 | `3.14`, `-0.001`, `2.0` | 科学计算 |
| `str` | 字符串 | `"hello"`, `'A'`, `"""多行"""` | 文本处理 |
| `bool` | 布尔 | `True`, `False` | 条件判断 |
| `list` | 列表 | `[1,2,3]`, `["a","b"]` | 有序可变序列 |
| `dict` | 字典 | `{"key":"value"}` | 键值对映射 |

类型转换函数：

```python
int("123")      # 123
str(456)        # "456"
float("3.14")   # 3.14
bool(0)         # False（非零为 True）
```

---

#### 4. 输入与输出（和用户对话）

```python
# 输出
print("你好")

# 输入（永远返回字符串）
age = input("请输入你的年龄：")   # 用户输入 "18"
print(type(age))  # <class 'str'>

# 必须手动转成整数才能比较
age_int = int(age)
```

---

#### 5. 算术运算符（优先级同数学，括号最优先）

| 运算符 | 含义 | 示例 | 结果 |
|--------|------|------|------|
| `+` | 加 | `3+2` | 5 |
| `-` | 减 | `3-2` | 1 |
| `*` | 乘 | `3*2` | 6 |
| `/` | 浮点除 | `3/2` | 1.5 |
| `//` | 整除（取商） | `3//2` | 1 |
| `%` | 取余 | `3%2` | 1 |
| `**` | 幂 | `3**2` | 9 |

字符串也能用 `+` 和 `*`：

```python
"Hi" + " " + "there"  # "Hi there"
"ha" * 3              # "hahaha"
```

---

#### 6. 比较运算符（返回布尔值）

| 运算符 | 含义 |
|--------|------|
| `==` | 等于 |
| `!=` | 不等于 |
| `>`  | 大于 |
| `<`  | 小于 |
| `>=` | 大于等于 |
| `<=` | 小于等于 |

```python
5 > 3   # True
"abc" == "ABC"  # False（区分大小写）
```

---

#### 7. 逻辑运算符（用于组合条件）

| 运算符 | 含义 | 示例 | 结果 |
|--------|------|------|------|
| `and` | 且 | `True and False` | False |
| `or`  | 或 | `True or False`  | True |
| `not` | 非 | `not True`       | False |

```python
age = 20
height = 175
if age >= 18 and height >= 170:
    print("符合条件")
```

---

#### 8. 条件判断（if / elif / else）—— 最重要的控制流

完整结构：

```python
if 条件1:
    执行语句块1
elif 条件2:
    执行语句块2
else:
    执行语句块3
```

注意：冒号 `:` 和缩进（必须 4 个空格或 1 个 Tab，但推荐空格）。

实例（结合 input）：

```python
score = int(input("输入成绩："))
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 60:
    grade = "C"
else:
    grade = "D"
print("等级：", grade)
```

---

#### 9. 循环（重复做事）

##### while 循环（条件为真时一直做）

```python
n = 0
while n < 5:
    print(n)
    n = n + 1   # 或者 n += 1
# 输出 0 1 2 3 4
```

##### for 循环（遍历序列）

```python
# 遍历列表
fruits = ["apple", "banana", "cherry"]
for f in fruits:
    print(f)

# 使用 range() 生成数字序列
for i in range(5):   # 0,1,2,3,4
    print(i)

for i in range(2, 8):   # 2,3,4,5,6,7
    print(i)

for i in range(0, 10, 2):   # 0,2,4,6,8（步长2）
    print(i)
```

break 和 continue：

- `break`：立即跳出循环

- `continue`：跳过本次剩余代码，进入下一次

```python
for i in range(10):
    if i == 3:
        continue   # 跳过3
    if i == 7:
        break      # 到7停止
    print(i)       # 输出 0 1 2 4 5 6
```

---

#### 10. 列表（list）—— 最常用的容器

创建与索引：

```python
L = [10, 20, 30, 40]
print(L[0])    # 10（正索引从0开始）
print(L[-1])   # 40（负索引从-1开始）
```

切片（取子列表）：

```python
L[1:3]    # [20, 30]（左闭右开）
L[:2]     # [10, 20]
L[2:]     # [30, 40]
L[::-1]   # [40, 30, 20, 10]（反转）
```

常用列表方法（表格）：

| 方法 | 作用 | 示例 |
|------|------|------|
| `append(x)` | 末尾添加元素 | `L.append(50)` → [10,20,30,40,50] |
| `insert(i,x)` | 在位置 i 插入 x | `L.insert(1,25)` → [10,25,20,30,40] |
| `remove(x)` | 删除第一个值为 x 的元素 | `L.remove(20)` |
| `pop(i)` | 删除并返回索引 i 的元素（默认末尾） | `L.pop()` → 40 |
| `index(x)` | 返回第一个 x 的索引 | `L.index(30)` → 2 |
| `sort()` | 原地排序 | `L.sort()` |
| `len(L)` | 返回长度（内置函数） | `len(L)` → 4 |

遍历列表并同时获得索引：

```python
for idx, val in enumerate(L):
    print(idx, val)
```

---

#### 11. 字典（dict）—— 键值对查找表

```python
student = {"name": "Li", "age": 20, "major": "Bio"}
print(student["name"])   # Li
student["age"] = 21      # 修改
student["gender"] = "M"  # 新增键
```

遍历字典：

```python
for key in student:
    print(key, student[key])

for key, value in student.items():
    print(key, "->", value)
```

常用方法：

```python
student.keys()    # 所有键
student.values()  # 所有值
student.get("score", 0)  # 获取，若不存在返回0（不报错）
```

---

#### 12. 函数（把重复代码包起来）

定义与调用：

```python
def greet(name):
    """这里写文档字符串（可选）"""
    print("Hello,", name)

greet("Zhang")   # 调用
```

带返回值的函数：

```python
def add(a, b):
    return a + b

result = add(3, 5)   # result = 8
```

默认参数：

```python
def power(x, n=2):
    return x ** n

power(3)     # 9
power(3, 3)  # 27
```

返回值可以是多个（元组自动打包）：

```python
def stats(numbers):
    return min(numbers), max(numbers), sum(numbers)/len(numbers)

mn, mx, avg = stats([1,2,3,4])   # 解包赋值
```

---

#### 13. 常用内置函数（快速参考）

| 函数 | 作用 | 示例 |
|------|------|------|
| `print()` | 打印输出 | `print("hi")` |
| `input()` | 接收用户输入 | `x = input()` |
| `len()` | 长度（字符串、列表等） | `len([1,2])` → 2 |
| `type()` | 返回类型 | `type(3)` → int |
| `int()`, `float()`, `str()` | 类型转换 | `int("5")` |
| `sum()`, `max()`, `min()` | 求和、最大、最小 | `sum([1,2,3])` → 6 |
| `sorted()` | 返回排序后的新列表 | `sorted([3,1,2])` → [1,2,3] |
| `range()` | 生成整数序列 | `list(range(3))` → [0,1,2] |

---

#### 14. 字符串常用操作（生物信息常用）

```python
seq = "ATCG"
seq.lower()        # "atcg"
seq.upper()        # "ATCG"
seq.replace("T", "U")  # "AUCG"
seq.count("A")     # 1
seq.find("T")      # 1（索引）
"ATCG" in seq      # True（成员判断）
len(seq)           # 4
seq[1:3]           # "TC"
```

格式化字符串（f-string，Python 3.6+）：

```python
name = "gene1"
length = 1200
print(f"基因 {name} 的长度是 {length} bp")
```

---

#### 15. 第一个完整生物信息小任务（结合所学）

任务：输入一段 DNA 序列，计算 GC 含量，并判断是否大于 50%。

```python
dna = input("请输入DNA序列（只含ATCG）：").upper()
g = dna.count('G')
c = dna.count('C')
gc = g + c
total = len(dna)
if total == 0:
    print("序列为空")
else:
    gc_percent = (gc / total) * 100
    print(f"GC含量：{gc_percent:.2f}%")   # :.2f 保留两位小数
    if gc_percent > 50:
        print("高GC序列")
    else:
        print("低GC序列")
```

---

#### 16. 常见错误及调试（学生必看）

| 错误信息（部分） | 原因 | 解决 |
|------------------|------|------|
| `SyntaxError: invalid syntax` | 漏了冒号、括号不匹配、中文符号 | 检查标点，全部英文 |
| `NameError: name 'x' is not defined` | 变量未定义或拼写错误 | 检查变量名 |
| `TypeError: can't convert ...` | 类型不匹配，如字符串+数字 | 用 `int()` 或 `str()` 转换 |
| `IndexError: list index out of range` | 索引超过列表长度 | 检查索引或 `len()` |
| `KeyError: 'key'` | 字典中不存在该键 | 用 `get()` 避免报错 |
| `IndentationError` | 缩进不一致 | 统一用 4 个空格 |

---

#### 17. 课后练习（只写代码，不运行也没关系）

1. 写一个程序，输入三个数字，输出最大值（不用 `max()`）。

2. 写一个函数 `reverse_complement(seq)`，返回 DNA 的反向互补（A↔T, C↔G）。

3. 给定列表 `[5, 2, 9, 1, 7]`，用 for 循环计算所有元素的和，并打印平均值。

4. 创建一个字典，记录 3 种氨基酸的名称和单字母缩写，然后根据用户输入的单字母输出全名。


### 第二课：文件操作、异常处理、推导式与模块

本课目标：

- 读取和写入文本文件（包括 FASTA 格式）

- 用 `with` 语句自动管理文件

- 用 `try/except` 捕获错误，避免程序崩溃

- 用列表推导式一行生成列表

- 导入标准库和自定义模块

- 认识 `sys.argv` 获取命令行参数

---

#### 1. 文件读取（最基础操作）

打开文件模式表格：

| 模式 | 含义 | 文件不存在 |
|------|------|------------|
| `'r'` | 只读（默认） | 报错 FileNotFoundError |
| `'w'` | 写入（覆盖原有内容） | 自动创建 |
| `'a'` | 追加（写到末尾） | 自动创建 |
| `'x'` | 独占创建，若存在则报错 | 创建新文件 |

读取整个文件内容（一次全部读入内存）：

```python
f = open("data.txt", "r")
content = f.read()
print(content)
f.close()   # 必须关闭
```

按行读取（推荐，适合大文件）：

```python
f = open("data.txt", "r")
for line in f:
    print(line.strip())   # strip() 去掉换行符
f.close()
```

读取所有行到列表：

```python
f = open("data.txt", "r")
lines = f.readlines()   # 每行作为一个字符串元素
f.close()
```

---

#### 2. 用 `with` 语句（自动关闭，推荐写法）

```python
with open("data.txt", "r") as f:
    content = f.read()
# 离开 with 块后自动关闭，无需手动 close()
```

按行读取的标准写法：

```python
with open("data.txt", "r") as f:
    for line in f:
        line = line.strip()
        if line:   # 跳过空行
            print(line)
```

---

#### 3. 文件写入

写入字符串（覆盖）：

```python
with open("output.txt", "w") as f:
    f.write("第一行\n")
    f.write("第二行\n")
```

追加内容：

```python
with open("output.txt", "a") as f:
    f.write("追加的这一行\n")
```

写入多行（使用 `writelines`，但不会自动加换行）：

```python
lines = ["A\n", "B\n", "C\n"]
with open("output.txt", "w") as f:
    f.writelines(lines)
```

---

#### 4. 实战：读取 FASTA 文件（生物信息最常用）

FASTA 格式示例（`seq.fasta`）：

```
>gene1
ATCGATCG
>gene2
GCTAGCTA
```

读取并存入字典（序列名 → 序列）：

```python
seq_dict = {}
with open("seq.fasta", "r") as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        if line.startswith(">"):
            name = line[1:]   # 去掉 '>'
            seq_dict[name] = ""
        else:
            seq_dict[name] += line   # 合并多行序列

print(seq_dict)
```

---

#### 5. 异常处理（try/except）—— 防止程序因错误退出

基本结构：

```python
try:
    可能出错的代码
except 错误类型 as 变量:
    出错后执行的备用代码
else:
    没出错时执行（可选）
finally:
    无论是否出错都执行（可选）
```

示例（处理文件不存在）：

```python
filename = input("输入文件名：")
try:
    with open(filename, "r") as f:
        data = f.read()
        print("文件长度：", len(data))
except FileNotFoundError:
    print(f"文件 {filename} 不存在，请检查路径")
except PermissionError:
    print("没有读取权限")
except Exception as e:   # 捕获所有其他异常
    print(f"未知错误：{e}")
else:
    print("读取成功")
```

处理类型转换错误：

```python
try:
    num = int(input("输入整数："))
except ValueError:
    print("你输入的不是有效整数，默认设为 0")
    num = 0
```

---

#### 6. 列表推导式（一行生成新列表）

基本语法：`[表达式 for 变量 in 可迭代对象 if 条件]`

示例对比：

```python
# 普通写法
squares = []
for i in range(10):
    squares.append(i**2)

# 列表推导式
squares = [i**2 for i in range(10)]
```

带条件过滤（只取偶数平方）：

```python
even_squares = [i**2 for i in range(10) if i % 2 == 0]
# [0, 4, 16, 36, 64]
```

字符串处理（提取 DNA 中的 A 和 T）：

```python
seq = "ATCGATCG"
only_AT = [ch for ch in seq if ch in "AT"]
# ['A', 'T', 'A', 'T']
```

嵌套推导（二维展平）：

```python
matrix = [[1,2], [3,4], [5,6]]
flat = [x for row in matrix for x in row]
# [1, 2, 3, 4, 5, 6]
```

---

#### 7. 字典推导式

```python
# 生成平方字典 {0:0, 1:1, 2:4, 3:9, 4:16}
square_dict = {i: i**2 for i in range(5)}

# 过滤
square_dict_even = {i: i**2 for i in range(5) if i % 2 == 0}
```

---

#### 8. 模块导入（使用别人或自己写的代码）

导入方式表格：

| 写法 | 调用方式 |
|------|----------|
| `import math` | `math.sqrt(4)` |
| `import math as m` | `m.sqrt(4)` |
| `from math import sqrt` | `sqrt(4)` |
| `from math import *` | `sqrt(4)`（不推荐，容易命名冲突） |

常用标准库（生物信息常用）：

| 模块 | 常用功能 |
|------|----------|
| `math` | `sqrt`, `log`, `pi`, `factorial` |
| `random` | `random()`, `randint(1,10)`, `choice(list)` |
| `os` | 文件路径操作 `os.path.join`, `os.listdir` |
| `sys` | 命令行参数 `sys.argv`, 退出 `sys.exit` |
| `re` | 正则表达式（后续会专门讲） |
| `collections` | `Counter` 计数（后面常用） |

示例：

```python
import math
import random
from collections import Counter

print(math.pi)
print(random.randint(1, 100))

seq_list = ["A", "T", "C", "A", "A", "G"]
counts = Counter(seq_list)
print(counts)   # Counter({'A': 3, 'T': 1, 'C': 1, 'G': 1})
```

---

#### 9. 命令行参数（`sys.argv`）

当你在终端执行 `python script.py arg1 arg2` 时，`sys.argv` 是一个列表：

- `sys.argv[0]` = 脚本文件名（`"script.py"`）

- `sys.argv[1]` = `"arg1"`

- `sys.argv[2]` = `"arg2"`

示例（`fasta_reader.py`）：

```python
import sys

if len(sys.argv) < 2:
    print("用法：python fasta_reader.py <文件名>")
    sys.exit(1)   # 退出，1表示错误

filename = sys.argv[1]
try:
    with open(filename, "r") as f:
        for line in f:
            print(line.strip())
except FileNotFoundError:
    print(f"文件 {filename} 不存在")
```

运行：

```bash
python fasta_reader.py seq.fasta
```

---

#### 10. 自定义模块（把你的函数放进另一个文件）

创建 `my_utils.py`：

```python
def gc_content(seq):
    g = seq.count('G')
    c = seq.count('C')
    return (g + c) / len(seq) * 100 if seq else 0

def reverse_complement(seq):
    comp = {'A':'T', 'T':'A', 'C':'G', 'G':'C'}
    return ''.join(comp[base] for base in reversed(seq) if base in comp)
```

在另一个脚本 `main.py` 中导入并使用：

```python
import my_utils
# 或者 from my_utils import gc_content, reverse_complement

seq = "ATCG"
print(my_utils.gc_content(seq))   # 50.0
print(my_utils.reverse_complement(seq))   # CGAT
```

**注意**：`my_utils.py` 和 `main.py` 必须在同一目录下，或者将路径加入 `sys.path`。

---

#### 11. 综合练习：读取 FASTA，计算每条序列的 GC 含量，输出到文件

```python
import sys

def gc_content(seq):
    if not seq:
        return 0
    return (seq.count('G') + seq.count('C')) / len(seq) * 100

if len(sys.argv) < 2:
    print("用法：python gc_calc.py input.fasta")
    sys.exit(1)

infile = sys.argv[1]
outfile = infile + ".gc.txt"

seq_dict = {}
with open(infile, "r") as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        if line.startswith(">"):
            name = line[1:]
            seq_dict[name] = ""
        else:
            seq_dict[name] += line

with open(outfile, "w") as f:
    f.write("基因名\tGC含量(%)\n")
    for name, seq in seq_dict.items():
        gc = gc_content(seq)
        f.write(f"{name}\t{gc:.2f}\n")

print(f"结果已写入 {outfile}")
```

---

#### 12. 常用文件操作（`os` 模块）速查表

| 函数 | 作用 | 示例 |
|------|------|------|
| `os.getcwd()` | 当前工作目录 | `os.getcwd()` → '/home/user' |
| `os.listdir(path)` | 列出目录下所有文件 | `os.listdir(".")` |
| `os.path.exists(path)` | 判断路径是否存在 | `os.path.exists("data.txt")` → True |
| `os.path.join(a,b)` | 跨平台拼接路径 | `os.path.join("dir", "file.txt")` → 'dir/file.txt' |
| `os.path.basename(path)` | 获取文件名 | `os.path.basename("/a/b/c.txt")` → 'c.txt' |
| `os.path.dirname(path)` | 获取目录 | `os.path.dirname("/a/b/c.txt")` → '/a/b' |
| `os.path.splitext(path)` | 分离扩展名 | `os.path.splitext("seq.fasta")` → ('seq', '.fasta') |

示例：

```python
import os
folder = "./data"
if not os.path.exists(folder):
    os.makedirs(folder)   # 创建目录

for fname in os.listdir(folder):
    if fname.endswith(".fasta"):
        fullpath = os.path.join(folder, fname)
        print(fullpath)
```

---

#### 13. 路径处理优先用 `pathlib`（更现代，推荐）

```python
from pathlib import Path

p = Path("./data/seq.fasta")
print(p.name)          # seq.fasta
print(p.stem)          # seq（无扩展名）
print(p.suffix)        # .fasta
print(p.parent)        # ./data
print(p.exists())      # True/False

# 读取文件
content = p.read_text()
# 写入文件
p.write_text(">gene1\nATCG\n")

# 遍历目录下所有 .fasta 文件
for f in Path(".").glob("*.fasta"):
    print(f)
```

---

#### 14. 本课错误排查

| 错误 | 常见原因 | 解决办法 |
|------|----------|----------|
| `FileNotFoundError` | 路径写错或文件不存在 | 用 `os.path.exists` 提前检查 |
| `PermissionError` | 无读写权限 | 修改文件权限或更换目录 |
| `UnicodeDecodeError` | 编码问题（含中文等） | `open(file, encoding='utf-8')` |
| `ModuleNotFoundError` | 模块未安装或路径不对 | `pip install 模块名` 或检查 `sys.path` |
| `IndentationError` | 缩进混用空格和 Tab | 统一用 4 个空格 |

---

#### 15. 课后练习

1. 写一个脚本，读取一个文本文件，统计其中有多少行、多少个单词（按空格分割），输出到屏幕。

2. 写一个函数 `read_fasta_to_dict(filename)`，返回字典，并在主程序中调用它。

3. 使用 `pathlib` 遍历当前目录下所有 `.txt` 文件，将每个文件的前 3 行打印出来。

4. 编写一个模块 `dna_tools.py`，包含 `gc_content`, `reverse_complement`, `transcribe(seq)`（T→U），然后在另一个脚本中导入并测试。

5. 写一个程序，用户输入一个整数，若输入非数字则捕获异常并提示重新输入，直到输入正确为止（用 `while` 循环）。


###第三课：Biopython 入门——Seq 对象与序列读写

本课目标：

- 安装 Biopython

- 创建和操作 `Seq` 对象（比字符串更强大）

- 做互补、反向互补、转录（DNA→RNA）和翻译（RNA→蛋白质）

- 用 `SeqIO` 读取和写入 FASTA / GenBank 文件

- 从文件中提取序列信息并计算统计量

---

#### 1. 安装 Biopython（只需要做一次）

在终端执行：

```bash
pip install biopython
```

或者（如果系统有多个 Python 版本）：

```bash
python3 -m pip install biopython
```

验证安装是否成功（在 Python 交互式环境中执行）：

```python
import Bio
print(Bio.__version__)
```

不报错且显示版本号（如 1.81）即成功。

---

#### 2. 第一个 Seq 对象（字符串的增强版）

```python
from Bio.Seq import Seq

my_seq = Seq("ATCGATCG")
print(my_seq)             # ATCGATCG
print(type(my_seq))       # <class 'Bio.Seq.Seq'>
```

Seq 对象支持所有字符串操作（切片、`count`、`+` 等），但额外增加了生物学方法。

```python
seq = Seq("ATCG")
print(seq[1:3])      # TC（切片）
print(len(seq))      # 4
print(seq.count("T")) # 1
```

---

#### 3. Seq 对象的常用生物学方法（表格）

| 方法 | 作用 | 示例 | 结果 |
|------|------|------|------|
| `.complement()` | 返回互补序列（不反转） | `Seq("ATCG").complement()` | `TAGC` |
| `.reverse_complement()` | 返回反向互补序列 | `Seq("ATCG").reverse_complement()` | `CGAT` |
| `.transcribe()` | DNA 转 RNA（T→U） | `Seq("ATCG").transcribe()` | `AUCG` |
| `.back_transcribe()` | RNA 转 DNA（U→T） | `Seq("AUCG").back_transcribe()` | `ATCG` |
| `.translate()` | RNA 或 DNA 翻译为蛋白质 | `Seq("AUGGCC").translate()` | `MA` |
| `.upper()` / `.lower()` | 转大小写 | `Seq("atcg").upper()` | `ATCG` |

**注意**：这些方法返回新的 `Seq` 对象，不修改原对象。

示例：

```python
from Bio.Seq import Seq

dna = Seq("ATGCGTACG")
rna = dna.transcribe()                # AUGCCUACG
protein = rna.translate()             # MPY（如果终止密码子提前结束）
rev_comp = dna.reverse_complement()   # CGTACGCAT

print(rna)
print(protein)
print(rev_comp)
```

---

#### 4. 翻译的细节（终止密码子处理）

默认 `translate()` 遇到终止密码子会停止翻译（返回部分肽段）。

```python
seq = Seq("AUGGCCUAAUGG")   # UAA 是终止密码子
print(seq.translate())      # MA（在 UAA 处停止）
```

如果想忽略终止密码子（继续翻译直到末尾，用 `*` 表示终止）：

```python
print(seq.translate(to_stop=False))   # MA*W（* 表示终止）
```

指定遗传密码表（细菌、线粒体等使用不同密码子表）：

```python
# 使用标准遗传密码（默认）
print(seq.translate(table=1))

# 使用线粒体遗传密码（脊椎动物线粒体，table=2）
print(seq.translate(table=2))
```

---

#### 5. Seq 与字符串的相互转换

```python
from Bio.Seq import Seq

seq = Seq("ATCG")
# Seq → str
seq_str = str(seq)          # "ATCG"

# str → Seq
new_seq = Seq(seq_str)      # Seq("ATCG")
```

大多数 Biopython 函数接受字符串或 Seq，但推荐使用 Seq 以使用生物学方法。

---

#### 6. 序列的字母表（Alphabet）概念（Biopython 1.x 风格，了解即可）

旧版本 Biopython 需要指定字母表（DNA / RNA / Protein），新版本（1.80+）已经弱化，但仍可能遇到旧代码。

```python
from Bio.Seq import Seq
from Bio.Alphabet import IUPAC

dna_seq = Seq("ATCG", IUPAC.unambiguous_dna)
rna_seq = Seq("AUCG", IUPAC.unambiguous_rna)
```

**现代推荐**：不用显式指定字母表，Biopython 会自动推断。

---

#### 7. 使用 `SeqRecord` 对象（序列 + ID + 描述 + 质量）

`SeqRecord` 是比 `Seq` 更完整的容器，用于存储一条序列及其元数据。

```python
from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord

record = SeqRecord(
    Seq("ATCGATCG"),
    id="gene001",
    name="gene1",
    description="example gene from human"
)

print(record.id)          # gene001
print(record.description) # example gene from human
print(record.seq)         # ATCGATCG
```

在读写文件时，`SeqIO` 返回的就是 `SeqRecord` 对象列表（或迭代器）。

---

#### 8. 用 `SeqIO` 读取单条 FASTA 文件

假设文件 `single.fasta` 内容：

```
>gene1 human sample
ATCGATCG
GCATGCAT
```

读取方式（`SeqIO.read` 用于文件中只有一条序列）：

```python
from Bio import SeqIO

record = SeqIO.read("single.fasta", "fasta")
print(record.id)          # gene1
print(record.description) # gene1 human sample
print(record.seq)         # ATCGATCGCATGCAT（合并了多行）
```

**注意**：如果文件有多条序列，`SeqIO.read` 会报错，此时必须用 `SeqIO.parse`。

---

#### 9. 用 `SeqIO.parse` 遍历多条序列（适合大文件）

假设 `multi.fasta` 内容：

```
>gene1
ATCG
>gene2
GCTA
>gene3
TCGA
```

遍历：

```python
from Bio import SeqIO

for record in SeqIO.parse("multi.fasta", "fasta"):
    print(record.id)
    print(len(record.seq))
    print(record.seq[:5])   # 前5个碱基
```

将所有记录存入列表（小文件可用）：

```python
records = list(SeqIO.parse("multi.fasta", "fasta"))
print(len(records))      # 3
print(records[0].id)     # gene1
```

`parse` 返回的是迭代器，只能遍历一次，如果想多次访问需转成列表或用 `list()`。

---

#### 10. 读取 GenBank 格式文件

GenBank 文件包含注释、CDS 位置、来源等信息。`SeqIO` 同样支持。

```python
from Bio import SeqIO

for record in SeqIO.parse("example.gb", "genbank"):
    print(record.id)
    print(record.description)
    print(len(record.seq))
    # 查看所有注释
    print(record.annotations.keys())
    # 查看特征（features）
    for feature in record.features:
        if feature.type == "CDS":
            print(feature.location, feature.qualifiers.get("translation", ""))
```

---

#### 11. 用 `SeqIO.write` 写入 FASTA 文件

```python
from Bio import SeqIO
from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord

rec1 = SeqRecord(Seq("ATCG"), id="seq1", description="first sequence")
rec2 = SeqRecord(Seq("GCTA"), id="seq2", description="second sequence")
records = [rec1, rec2]

SeqIO.write(records, "output.fasta", "fasta")
```

**注意**：`SeqIO.write` 的第一个参数可以是单个记录、记录列表或迭代器。

写入 GenBank 格式：

```python
SeqIO.write(records, "output.gb", "genbank")
```

---

#### 12. 常用序列工具（`Bio.SeqUtils`）

```python
from Bio.SeqUtils import GC, molecular_weight, MeltingTemp as mt
from Bio.Seq import Seq

seq = Seq("ATGCGTACG")

# GC 含量（百分比）
gc = GC(seq)   # 55.555...

# 分子量（近似，单链DNA，钠盐形式）
mw = molecular_weight(seq, "DNA")   # 约 2740 Da

# 熔解温度（Tm，适用于引物，使用不同公式）
# 使用 GC 法（适用于 <20bp）
tm = mt.Tm_GC(seq)   # 约 34.0°C
```

快速参考表（`Bio.SeqUtils` 常用函数）：

| 函数 | 作用 | 示例 |
|------|------|------|
| `GC(seq)` | 返回 GC 百分比（浮点数） | `GC("ATCG")` → 50.0 |
| `molecular_weight(seq, type)` | 分子量，type="DNA"/"RNA"/"protein" | `molecular_weight(seq, "DNA")` |
| `seq1 = nt_search(seq, pattern)` | 在序列中搜索模式（支持简并碱基） | 返回匹配位置 |
| `MeltingTemp.Tm_GC(seq)` | 基于 GC 含量的 Tm | `Tm_GC("ATCG")` → ~26°C |

---

#### 13. 处理简并碱基（IUPAC 模糊密码）

Biopython 支持 IUPAC 简并碱基符号（R, Y, S, W, K, M, D, V, H, B, N）。

```python
from Bio.Seq import Seq
from Bio.Alphabet import IUPAC  # 若需指定

seq = Seq("ARYN", IUPAC.ambiguous_dna)
print(seq)   # ARYN
```

在搜索时可以使用 `Bio.SeqUtils.nt_search` 查找简并模式的匹配。

```python
from Bio.SeqUtils import nt_search

seq = "ATCGATCG"
result = nt_search(seq, "AT")   # 返回 [pattern, 位置1, 位置2, ...]
print(result)   # ['AT', 0, 4]
```

---

#### 14. 实战：读取 FASTA，计算每条序列的 GC 和分子量，输出 TSV 表格

```python
from Bio import SeqIO
from Bio.SeqUtils import GC, molecular_weight
import sys

if len(sys.argv) < 2:
    print("用法：python analyze_fasta.py input.fasta")
    sys.exit(1)

infile = sys.argv[1]
outfile = infile + ".stats.tsv"

with open(outfile, "w") as out:
    out.write("ID\t长度\tGC(%)\t分子量(Da)\n")
    for record in SeqIO.parse(infile, "fasta"):
        seq = record.seq
        length = len(seq)
        gc = GC(seq)
        mw = molecular_weight(seq, "DNA")
        out.write(f"{record.id}\t{length}\t{gc:.2f}\t{mw:.2f}\n")

print(f"统计结果已写入 {outfile}")
```

---

#### 15. 批量转换 FASTA 格式（例如从 FASTA 转 GenBank，但需补充注释）

简单转换（只保留序列和 ID，GenBank 缺少注释会警告，但仍然可读）：

```python
from Bio import SeqIO

records = list(SeqIO.parse("input.fasta", "fasta"))
SeqIO.write(records, "output.gb", "genbank")
```

---

#### 16. 常见错误与解决（Biopython 专用）

| 错误信息 | 原因 | 解决办法 |
|----------|------|----------|
| `ValueError: No records found in file` | `SeqIO.read` 用于空文件或无记录 | 改用 `SeqIO.parse`，或检查文件是否为空 |
| `ValueError: Multiple records found` | `SeqIO.read` 读到多条序列 | 改用 `SeqIO.parse` 遍历 |
| `KeyError: 'translation'` | 特征中没有 translation 键 | 用 `feature.qualifiers.get("translation", ["-"])[0]` 安全获取 |
| `AttributeError: 'Seq' object has no attribute 'translate'` | 导入错误，可能用的是字符串 | 确保用 `from Bio.Seq import Seq` 创建对象 |
| `Bio.SeqUtils.molecular_weight` 返回整数？ | 版本差异 | 检查是否传入了 `Seq` 对象而非字符串 |

---

#### 17. 课内小练习（用刚学的内容）

1. 创建一个 `Seq` 对象 `dna = Seq("ATGCGTACGTAG")`，打印它的反向互补序列和转录后的 RNA。

2. 读取提供的 `genes.fasta` 文件，打印每条序列的 ID 和长度。

3. 写一个程序，读取 FASTA，计算每条序列的 GC 含量，只输出 GC > 60% 的序列到一个新 FASTA 文件（过滤）。

4. 从 GenBank 文件中提取所有 CDS 的翻译产物（蛋白质序列），写入一个新的 FASTA 文件（以基因名为 ID）。

5. 使用 `Bio.SeqUtils.molecular_weight` 计算一段 DNA 和它对应的蛋白质的分子量，对比差异。


### 第四课：Biopython 进阶——Pairwise 比对、本地 BLAST、多序列比对读写

本课目标：

- 用 `PairwiseAligner` 做全局（Needleman-Wunsch）和局部（Smith-Waterman）双序列比对

- 控制匹配得分、错配罚分、缺口罚分

- 解析比对结果并输出美观的比对字符串

- 调用本地 BLAST+ 程序（命令行包装）

- 解析 BLAST 的 XML 输出

- 读写多序列比对文件（ClustalW、Stockholm、Phylip）

---

#### 1. 准备工作：安装 BLAST+ 命令行（如果要做本地 BLAST）

Biopython 本身不带 BLAST 程序，需要额外安装 NCBI BLAST+。

- Linux（Ubuntu/Debian）：`sudo apt install ncbi-blast+`

- Mac（Homebrew）：`brew install blast`

- Windows：从 NCBI 官网下载安装包，并添加环境变量

验证安装：

```bash
blastn -version
```

如果不做本地 BLAST，本章第 5-6 节可跳过，不影响其他内容。

---

#### 2. 双序列比对（Pairwise Alignment）—— `Bio.Align.PairwiseAligner`

导入方式：

```python
from Bio.Align import PairwiseAligner
from Bio.Seq import Seq
```

创建比对器并设置参数：

```python
aligner = PairwiseAligner()
aligner.mode = "global"          # 全局比对（两端对齐）
# aligner.mode = "local"         # 局部比对（找相似片段）
aligner.match_score = 1          # 匹配得 1 分
aligner.mismatch_score = -1      # 错配扣 1 分
aligner.open_gap_score = -2      # 打开缺口扣 2 分
aligner.extend_gap_score = -0.5  # 延伸缺口每个位置扣 0.5 分
```

进行比对：

```python
seq1 = Seq("ATCGATCG")
seq2 = Seq("ATCGGCG")
alignments = aligner.align(seq1, seq2)
```

---

#### 3. 获取比对结果（得分、坐标、对齐字符串）

```python
for aln in alignments:
    print("得分：", aln.score)
    print(aln)   # 直接打印美观的比对格式
    # 获取第一条序列的对齐字符串
    print(aln[0])
    print(aln[1])
    # 获取坐标（起始位置，结束位置）
    print("seq1 坐标：", aln.coordinates[0])
    print("seq2 坐标：", aln.coordinates[1])
    break   # 通常取第一个最优比对
```

示例输出：

```
得分： 5.0
ATCGATCG
||| | || 
ATCG--GCG
```

**重要**：`aln` 可以迭代两个序列，`aln[0]` 是第一条序列的比对字符串（含缺口 `-`），`aln[1]` 是第二条。

---

#### 4. 比对参数调整速查表

| 参数 | 含义 | 常用取值 | 影响 |
|------|------|----------|------|
| `mode` | 比对模式 | `"global"` / `"local"` | 全局强制两端对齐；局部只找最佳相似片段 |
| `match_score` | 匹配得分 | 1 或 2 | 越高越鼓励匹配 |
| `mismatch_score` | 错配得分（负值） | -1 或 -2 | 越负越惩罚错配 |
| `open_gap_score` | 打开缺口罚分（负值） | -2 ~ -10 | 控制缺口数量 |
| `extend_gap_score` | 延伸缺口罚分（负值） | -0.5 ~ -2 | 控制缺口长度 |

选择不同罚分得到不同比对结果：

```python
# 低缺口罚分 → 允许更多缺口
aligner.open_gap_score = -1
aligner.extend_gap_score = -0.2

# 高缺口罚分 → 尽量少缺口
aligner.open_gap_score = -10
aligner.extend_gap_score = -5
```

---

#### 5. 本地 BLAST 调用（`NcbiblastCommandline`）

Biopython 提供了 `Bio.Blast.Applications` 模块，生成 BLAST 命令行并执行。

```python
from Bio.Blast.Applications import NcbiblastnCommandline
```

构建命令（以 blastn 为例）：

```python
blastn_cline = NcbiblastnCommandline(
    query="query.fasta",
    db="nt",
    out="blast_result.xml",
    outfmt=5,          # 5 = XML 格式
    evalue=0.001,
    num_threads=4
)
print(blastn_cline)    # 打印实际命令
stdout, stderr = blastn_cline()
```

**注意**：`db` 必须是已经建好索引的 BLAST 数据库。如果是自建库，先用 `makeblastdb`。

**使用自定义数据库**：

```bash
# 终端先建索引
makeblastdb -in my_sequences.fasta -dbtype nucl -out my_db
```

然后在 Python 中：

```python
blastn_cline = NcbiblastnCommandline(
    query="query.fasta",
    db="my_db",
    out="result.xml",
    outfmt=5
)
```

---

#### 6. 解析 BLAST XML 输出（`NCBIXML`）

```python
from Bio.Blast import NCBIXML

with open("blast_result.xml") as f:
    blast_record = NCBIXML.read(f)   # 单条查询
    # 如果是多条查询，用 NCBIXML.parse(f)
    
for alignment in blast_record.alignments:
    for hsp in alignment.hsps:
        print("命中序列 ID：", alignment.hit_id)
        print("e-value：", hsp.expect)
        print("一致性：", hsp.identities / hsp.align_length * 100)
        print("比对片段：")
        print(hsp.query)
        print(hsp.match)   # 显示匹配符号
        print(hsp.sbjct)
        print("---")
```

重要属性速查：

| 对象 | 属性 | 含义 |
|------|------|------|
| `blast_record` | `.alignments` | 所有命中的列表 |
| `alignment` | `.hit_id` | 目标序列 ID |
| `alignment` | `.hsps` | 高分段对（HSP）列表 |
| `hsp` | `.expect` | e-value |
| `hsp` | `.identities` | 相同碱基数（整数） |
| `hsp` | `.align_length` | 比对长度 |
| `hsp` | `.query` | 查询序列比对字符串 |
| `hsp` | `.sbjct` | 目标序列比对字符串 |
| `hsp` | `.match` | 匹配符号（`|` 表示相同） |

---

#### 7. 多序列比对文件读写（`AlignIO`）

Biopython 支持 ClustalW、Stockholm、Phylip、FASTA（比对格式）等。

读取 Clustal 文件（`.aln`）：

```python
from Bio import AlignIO

alignment = AlignIO.read("alignment.aln", "clustal")
print("序列数量：", len(alignment))
print("比对长度：", alignment.get_alignment_length())

for record in alignment:
    print(record.id)
    print(record.seq)
```

读取 Stockholm 格式（常用于 Pfam）：

```python
alignment = AlignIO.read("alignment.sth", "stockholm")
```

遍历所有记录（`record` 是 `SeqRecord`，序列已包含缺口 `-`）。

---

#### 8. 写入多序列比对文件

```python
from Bio import AlignIO
from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord

rec1 = SeqRecord(Seq("ATCG--ATCG"), id="seq1")
rec2 = SeqRecord(Seq("ATCGAT--CG"), id="seq2")
rec3 = SeqRecord(Seq("ATCGATCG--"), id="seq3")
alignment = [rec1, rec2, rec3]   # 或 AlignIO.MultipleSeqAlignment

AlignIO.write(alignment, "output.aln", "clustal")
```

写入 Phylip 格式（用于系统发育软件）：

```python
AlignIO.write(alignment, "output.phy", "phylip")
```

**注意**：Phylip 要求序列名不超过 10 个字符（旧版），可以启用宽松模式：

```python
AlignIO.write(alignment, "output.phy", "phylip-relaxed")
```

---

#### 9. 转换比对格式（快速转换器）

```python
from Bio import AlignIO

align = AlignIO.read("input.aln", "clustal")
AlignIO.write(align, "output.sth", "stockholm")
```

批量转换所有文件：

```python
import os
from Bio import AlignIO

for fname in os.listdir("."):
    if fname.endswith(".aln"):
        outname = fname.replace(".aln", ".phy")
        align = AlignIO.read(fname, "clustal")
        AlignIO.write(align, outname, "phylip")
```

---

#### 10. 提取多序列比对的特定列或区域

```python
from Bio import AlignIO

align = AlignIO.read("alignment.aln", "clustal")
# 提取第 10 到 20 列（0-based，左闭右开）
sub_align = align[:, 10:20]
print(sub_align.get_alignment_length())   # 10

# 提取特定行（某个物种）
for record in align:
    if record.id == "Homo_sapiens":
        print(record.seq[10:20])
```

---

#### 11. 计算多序列比对的一致性（保守度）

简单计算每个位置的最常见碱基：

```python
from Bio import AlignIO
from collections import Counter

align = AlignIO.read("alignment.aln", "clustal")
length = align.get_alignment_length()

consensus = []
for i in range(length):
    col = align[:, i]   # 第 i 列的所有字符
    # 排除缺口
    bases = [c for c in col if c != '-']
    if bases:
        most_common = Counter(bases).most_common(1)[0][0]
    else:
        most_common = '-'
    consensus.append(most_common)

print(''.join(consensus))
```

---

#### 12. 处理比对中的缺口（去除含缺口列或行）

去除所有含缺口的列（完全保守列）：

```python
from Bio import AlignIO

align = AlignIO.read("alignment.aln", "clustal")
# 取出所有列，过滤掉包含 '-' 的列
clean_align = align[:, [i for i in range(align.get_alignment_length()) 
                         if '-' not in align[:, i]]]
AlignIO.write(clean_align, "clean.aln", "clustal")
```

---

#### 13. 常见错误及解决（比对 + BLAST + AlignIO）

| 错误 | 原因 | 解决 |
|------|------|------|
| `FileNotFoundError: 'blastn' not found` | BLAST+ 未安装或未在 PATH | 安装或指定绝对路径 `NcbiblastnCommandline(cmd="C:/blast/bin/blastn")` |
| `NCBIXML.read()` 报错 | XML 文件格式损坏或不是单条查询 | 检查文件是否完整，或用 `NCBIXML.parse` 迭代 |
| `AlignIO.read` 报 `ValueError` | 文件中有多条比对？实际只有一条？ | 确认文件格式，若有多条用 `AlignIO.parse` |
| `IndexError` 访问 `aln[0]` | 没有比对结果（空列表） | 先判断 `if alignments:` |
| 比对结果中全是 `-` | 序列太不相似或罚分设置不当 | 降低缺口罚分，或改用局部比对模式 |
| `get_alignment_length()` 返回 0 | 比对文件为空或读错格式 | 检查文件内容和格式参数 |

---

#### 14. 本课综合实战：从 FASTA 做 Pairwise 比对并输出美观格式

```python
from Bio import Align
from Bio.Seq import Seq

seq1 = Seq("ATCGTACGATCG")
seq2 = Seq("ATCGTAGATCG")

aligner = Align.PairwiseAligner()
aligner.mode = "global"
aligner.match_score = 2
aligner.mismatch_score = -1
aligner.open_gap_score = -2
aligner.extend_gap_score = -1

alignments = aligner.align(seq1, seq2)
best = alignments[0]   # 取第一个

print("最优得分：", best.score)
print("比对长度：", len(best[0]))
# 手动打印带空格的格式化输出
q = best[0]
s = best[1]
# 生成匹配符号：相同为 '|'，不同为 ' '，缺口为 ' '
match_symbols = []
for a, b in zip(q, s):
    if a == b and a != '-':
        match_symbols.append('|')
    else:
        match_symbols.append(' ')
match_str = ''.join(match_symbols)

print(q)
print(match_str)
print(s)
```

输出示例：

```
ATCGTACGATCG
|| || |||  |
ATCGTAG--ATCG
```

---

#### 15. 课后练习

1. 用 `PairwiseAligner` 对两段 DNA 做局部比对，然后尝试不同缺口罚分，观察比对结果变化。

2. 写一个函数，输入两个 Seq 对象，返回它们的全局比对得分和比对字符串（含 `|` 符号）。

3. 下载一个本地 FASTA 文件作为数据库，用 `makeblastdb` 建索引，然后用 Python 调用 blastn 搜索一条短序列，解析 XML 并打印 e-value 最高的 3 个命中。

4. 读取一个 Clustal 比对文件，计算每个位置的保守性（用 Shannon 熵或简单多数），输出一个列表。

5. 将多序列比对中的每一列统计 A/T/C/G/- 的频数，输出一个 CSV 文件（列为位置，行为碱基频数）。

### 第五课：Biopython 与 R 的连接——rpy2 与数据可视化

本课目标：

- 安装 R 和 rpy2

- 从 Python 中启动 R 并执行 R 代码

- 在 Python 和 R 之间传递向量、数据框

- 调用 R 的统计函数（mean、sd、t.test）

- 使用 ggplot2 在 Python 中生成高质量统计图

- 将 Biopython 的序列分析结果（GC含量、长度等）传递给 R 做可视化

---

#### 1. 安装 R 和 rpy2

**第一步：安装 R**（若系统已有可跳过）

- Linux (Ubuntu/Debian)：`sudo apt install r-base`

- Mac：`brew install r` 或从 CRAN 下载

- Windows：从 https://cran.r-project.org 下载安装

验证 R 是否可用：

```bash
R --version
```

**第二步：安装 rpy2**（Python 包）

```bash
pip install rpy2
```

如果遇到编译问题（Linux 需要 R 开发库）：

```bash
sudo apt install r-base-dev
pip install rpy2
```

**第三步：测试 rpy2 是否成功**

```python
import rpy2.robjects as ro
print(ro.r('R.version.string')[0])  # 应显示 R 版本号
```

---

#### 2. rpy2 基础：执行 R 代码

```python
import rpy2.robjects as ro

# 执行单行 R 代码
ro.r('x <- c(1,2,3,4,5)')
ro.r('mean_x <- mean(x)')
mean_x = ro.r('mean_x')[0]   # 提取 R 返回值
print(mean_x)   # 3.0

# 执行多行 R 代码
ro.r('''
y <- c(6,7,8,9,10)
y_mean <- mean(y)
''')
y_mean = ro.r('y_mean')[0]
print(y_mean)   # 8.0
```

---

#### 3. R 与 Python 的数据类型转换

rpy2 自动转换常见类型：

| Python 类型 | R 类型（在 R 中） | 转换函数 |
|-------------|-------------------|----------|
| `int` / `float` | 标量（长度1的向量） | 自动 |
| `list` | `list` | `ro.vectors.ListVector` |
| `list` of numbers | `numeric` 向量 | `ro.FloatVector(list)` |
| `list` of strings | `character` 向量 | `ro.StrVector(list)` |
| `dict` | `list`（命名）或 `data.frame` | 需手动构造 |
| `pandas.DataFrame` | `data.frame` | `ro.conversion.py2ri()` 或 `ro.default_converter` |

**显式转换示例**：

```python
import rpy2.robjects as ro

# Python 列表 → R 数值向量
py_list = [1.2, 3.4, 5.6]
r_vector = ro.FloatVector(py_list)

# Python 列表 → R 字符向量
py_names = ["A", "B", "C"]
r_char = ro.StrVector(py_names)

# 在 R 中创建命名向量
ro.r.assign('myvec', r_vector)
ro.r('names(myvec) <- c("a","b","c")')
```

---

#### 4. 从 Python 创建 R 数据框（data.frame）

```python
import rpy2.robjects as ro
from rpy2.robjects import pandas2ri

# 方法一：用 R 的 data.frame 函数
df = ro.r('data.frame')(name=ro.StrVector(['A','B','C']),
                         value=ro.FloatVector([1.1, 2.2, 3.3]))
print(df)

# 方法二：从 pandas DataFrame 转换（推荐）
import pandas as pd
pandas_df = pd.DataFrame({
    'gene': ['gene1', 'gene2', 'gene3'],
    'gc': [45.2, 62.1, 51.7],
    'length': [1200, 800, 1500]
})
# 启用 pandas 到 R 的转换
pandas2ri.activate()
r_df = ro.conversion.py2ri(pandas_df)
# 或者直接 r_df = pandas2ri.py2ri(pandas_df)
```

转换后，`r_df` 就是一个 R 的 `data.frame`，可用于 ggplot2。

---

#### 5. 从 R 数据框提取数据回 Python

```python
# 将 R data.frame 转回 pandas
pandas2ri.activate()
py_df = ro.conversion.rpy2py(r_df)
print(py_df.head())

# 提取某一列（R 向量 → Python 列表）
r_col = r_df.rx2('gc')   # rx2 按列名取
py_col = list(r_col)
print(py_col)
```

---

#### 6. 调用 R 的统计函数（示例）

```python
import rpy2.robjects as ro
import rpy2.robjects.packages as rpackages

# 调用基础 R 函数
x = ro.FloatVector([10, 20, 30, 40, 50])
r_mean = ro.r['mean'](x)[0]
r_sd = ro.r['sd'](x)[0]
print(f"mean={r_mean}, sd={r_sd}")

# t.test 示例
y = ro.FloatVector([12, 18, 29, 42, 48])
t_result = ro.r['t.test'](x, y)
# t_result 是一个列表，提取 p-value
p_val = t_result.rx2('p.value')[0]
print("p-value:", p_val)
```

---

#### 7. 安装和加载 ggplot2（以及 tidyverse）

在 Python 中安装 R 包：

```python
utils = rpackages.importr('utils')
utils.install_packages('ggplot2')
# 如果使用镜像，可设置：
utils.chooseCRANmirror(ind=1)  # 选择第一个镜像
```

加载 ggplot2：

```python
from rpy2.robjects.packages import importr
ggplot2 = importr('ggplot2')
```

---

#### 8. 用 ggplot2 在 Python 中绘图（基础）

准备数据（R data.frame），然后创建 ggplot 对象，最后用 `ggsave` 保存。

```python
import rpy2.robjects as ro
from rpy2.robjects.packages import importr
import rpy2.robjects.pandas2ri as pandas2ri
import pandas as pd

pandas2ri.activate()

# 准备 pandas 数据
df = pd.DataFrame({
    'gene': ['A', 'B', 'C', 'D'],
    'gc': [45, 62, 51, 70],
    'length': [1200, 800, 1500, 900]
})
r_df = pandas2ri.py2ri(df)

# 加载 ggplot2
ggplot2 = importr('ggplot2')

# 创建散点图
p = (ggplot2.ggplot(data=r_df) +
     ggplot2.aes_string(x='length', y='gc') +
     ggplot2.geom_point(size=3) +
     ggplot2.geom_smooth(method='lm', se=False) +
     ggplot2.ggtitle('GC vs Length'))

# 显示图形（如果支持图形设备）
from rpy2.robjects import r
r('print(p)')   # 或者直接 p.plot() 在某些版本中

# 保存图片
ggplot2.ggsave('gc_vs_length.png', p, width=8, height=6)
```

**柱状图示例（按基因 GC 含量）**：

```python
p_bar = (ggplot2.ggplot(data=r_df) +
         ggplot2.aes_string(x='gene', y='gc') +
         ggplot2.geom_col(fill='steelblue') +
         ggplot2.theme_minimal() +
         ggplot2.labs(x='Gene', y='GC %'))
ggplot2.ggsave('barplot.png', p_bar)
```

---

#### 9. 将 Biopython 分析结果传给 R 作图（完整实战）

结合第三课的 FASTA 分析，计算每条序列的 GC 和长度，然后用 ggplot2 绘制散点图 + 直方图。

```python
from Bio import SeqIO
from Bio.SeqUtils import GC
import pandas as pd
import rpy2.robjects as ro
from rpy2.robjects.packages import importr
import rpy2.robjects.pandas2ri as pandas2ri

pandas2ri.activate()
ggplot2 = importr('ggplot2')

# 第一步：用 Biopython 读取 FASTA 并计算统计量
records = list(SeqIO.parse("multi.fasta", "fasta"))
data = []
for rec in records:
    seq = rec.seq
    data.append({
        'id': rec.id,
        'length': len(seq),
        'gc': GC(seq),
        'a_count': seq.count('A'),
        't_count': seq.count('T')
    })

df = pd.DataFrame(data)

# 第二步：传递给 R 并作图
r_df = pandas2ri.py2ri(df)

# 散点图（长度 vs GC）
p1 = (ggplot2.ggplot(data=r_df) +
      ggplot2.aes_string(x='length', y='gc') +
      ggplot2.geom_point(aes_string(color='id'), size=4) +
      ggplot2.labs(title='GC vs Sequence Length') +
      ggplot2.theme_bw())
ggplot2.ggsave('seq_scatter.png', p1, width=6, height=4)

# 直方图（GC 分布）
p2 = (ggplot2.ggplot(data=r_df) +
      ggplot2.aes_string(x='gc') +
      ggplot2.geom_histogram(bins=10, fill='skyblue', color='black') +
      ggplot2.labs(x='GC %', y='Count') +
      ggplot2.theme_minimal())
ggplot2.ggsave('gc_hist.png', p2)

print("图片已保存")
```

---

#### 10. 在 R 中执行自定义函数并接收返回值

```python
# 定义 R 函数（字符串）
r_func = '''
custom_stat <- function(vec) {
    return(c(mean=mean(vec), median=median(vec), sd=sd(vec)))
}
'''
ro.r(r_func)

# 调用
vec = ro.FloatVector([1,2,3,4,5,6,7,8,9,10])
result = ro.r['custom_stat'](vec)
# result 是一个命名向量
print(result)   # mean median sd ...
print(result.rx2('mean')[0])
```

---

#### 11. 处理 R 的错误和警告

rpy2 默认会将 R 的警告和错误转换为 Python 异常。捕获方式：

```python
from rpy2.rinterface_lib import embedded
try:
    ro.r('stop("R error")')
except embedded.RRuntimeError as e:
    print("捕获到 R 错误：", e)
```

如果想忽略 R 警告：

```python
ro.r('options(warn=-1)')   # 关闭警告
# 恢复警告
ro.r('options(warn=0)')
```

---

#### 12. 常见问题及解决（rpy2 专有）

| 问题 | 原因 | 解决 |
|------|------|------|
| 安装 rpy2 报错 | 缺少 R 开发头文件 | 安装 `r-base-dev`（Linux）或重新安装 R 并包含开发组件 |
| `RRuntimeError: Error in library(ggplot2) : there is no package called ‘ggplot2’` | R 中未安装 ggplot2 | 在 R 中执行 `install.packages("ggplot2")`，或在 Python 中用 `utils.install_packages('ggplot2')` |
| 图形不显示 | R 图形设备未打开 | 用 `ggsave` 保存文件，或用 `ro.r('dev.new()')` 打开设备 |
| 转换 pandas 报错 | pandas2ri 未激活 | 调用 `pandas2ri.activate()` |
| 中文乱码 | 系统编码问题 | 在 R 中设置 `ro.r('Sys.setlocale("LC_ALL", "en_US.UTF-8")')` |
| `ImportError: No module named 'rpy2.robjects.pandas2ri'` | rpy2 版本过低 | 升级 `pip install --upgrade rpy2` |

---

#### 13. 备选方案：不装 rpy2，直接调用 R 脚本（用 subprocess）

如果 rpy2 安装困难，可以用系统命令调用 R 脚本并传递数据（通过 CSV）。

```python
import subprocess
import pandas as pd

# 生成 CSV
df = pd.DataFrame({'x': [1,2,3], 'y': [4,5,6]})
df.to_csv('data.csv', index=False)

# 编写 R 脚本（字符串）
r_script = '''
data <- read.csv("data.csv")
pdf("plot.pdf")
plot(data$x, data$y)
dev.off()
'''
with open('script.R', 'w') as f:
    f.write(r_script)

# 执行
subprocess.run(['Rscript', 'script.R'], check=True)
```

这种方法无需 rpy2，但灵活性较低（需文件 IO）。

---

#### 14. 课后练习

1. 安装 rpy2 并成功执行 `ro.r('print("Hello R")')`，打印出 R 的输出版本。

2. 在 Python 中创建一个包含 20 个随机数的列表，传递给 R，计算其均值、标准差、中位数，并打印结果。

3. 使用 pandas 创建一个数据框（包含基因、表达量、组别），用 rpy2 传递给 R，用 ggplot2 绘制箱线图（组别为 x，表达量为 y），保存为 PNG。

4. 结合 Biopython 读取一个 FASTA 文件，计算每条序列的 GC、长度、AT 比例，传给 R 绘制三个变量两两之间的散点图矩阵（可以用 `GGally::ggpairs`，需安装 GGally 包）。

5. 写一个通用函数 `plot_gc_distribution(fasta_file, output_png)`，用 Biopython 读取，用 R 的 ggplot2 绘制 GC 含量直方图并保存。


### 第六课：SQL 数据库基础——查询、筛选、连接与在生物信息中的应用

本课目标：

- 理解关系型数据库的基本概念（表、行、列、主键）

- 掌握 SQL 中最常用的 `SELECT`、`WHERE`、`ORDER BY`、`GROUP BY`、`JOIN`

- 学会在 Python 中使用内置 `sqlite3` 模块创建和查询数据库

- 将 Biopython 解析的序列数据存入 SQLite，并用 SQL 进行筛选和统计

- 理解如何将 BLAST 结果或基因注释存为数据库以便快速检索

---

#### 1. 为什么要学 SQL？（生物信息场景）

- 存储大量序列注释信息（如基因名、GO 术语、染色体位置）

- 快速筛选：例如“找出长度大于 1000 bp 且 GC > 60% 的基因”

- 关联多个表格：例如将序列表与表达量表连接，查询高表达基因的序列

- 比 Excel 更高效处理百万行数据

---

#### 2. SQL 基础概念（只讲关系型，以 SQLite 为例）

| 概念 | 对应 Excel | 说明 |
|------|------------|------|
| 数据库（Database） | 一个工作簿文件 | 包含多个表 |
| 表（Table） | 一个工作表 | 由行和列组成 |
| 列（Column） | 字段（标题） | 有名称和数据类型（INTEGER, TEXT, REAL, BLOB） |
| 行（Row） | 一条记录 | 每个记录包含所有列的值 |
| 主键（Primary Key） | 唯一标识列 | 每行不重复，例如基因 ID |

SQLite 是轻量级嵌入式数据库，Python 内置支持，无需安装服务器，适合教学。

---

#### 3. 在 Python 中创建 SQLite 数据库和表（`sqlite3` 模块）

```python
import sqlite3

# 连接数据库（如果文件不存在则自动创建）
conn = sqlite3.connect("genes.db")
cursor = conn.cursor()

# 创建表（如果不存在）
cursor.execute('''
CREATE TABLE IF NOT EXISTS genes (
    gene_id TEXT PRIMARY KEY,
    sequence TEXT,
    length INTEGER,
    gc REAL,
    chromosome TEXT
)
''')

# 提交并关闭
conn.commit()
conn.close()
```

**注意**：每次执行完操作后需 `commit()` 才能保存。

---

#### 4. 插入数据（单条和多条）

单条插入：

```python
conn = sqlite3.connect("genes.db")
cursor = conn.cursor()

cursor.execute('''
INSERT INTO genes (gene_id, sequence, length, gc, chromosome)
VALUES ('BRCA1', 'ATCGATCGATCG', 12, 50.0, '17')
''')
conn.commit()
```

安全插入（防止 SQL 注入，推荐使用占位符 `?`）：

```python
data = ('TP53', 'GCATGCAT', 8, 62.5, '17')
cursor.execute('INSERT INTO genes VALUES (?, ?, ?, ?, ?)', data)
conn.commit()
```

批量插入多条：

```python
records = [
    ('EGFR', 'ATATATAT', 8, 25.0, '7'),
    ('MYC', 'GCCGCCGC', 8, 75.0, '8')
]
cursor.executemany('INSERT INTO genes VALUES (?,?,?,?,?)', records)
conn.commit()
conn.close()
```

---

#### 5. 查询基础（`SELECT` 语句）

语法结构：

```sql
SELECT 列名1, 列名2, ...
FROM 表名
WHERE 条件
ORDER BY 列名 ASC/DESC
LIMIT 数量;
```

在 Python 中执行查询并获取结果：

```python
conn = sqlite3.connect("genes.db")
cursor = conn.cursor()

cursor.execute('SELECT gene_id, length, gc FROM genes')
rows = cursor.fetchall()   # 返回列表，每个元素是元组
for row in rows:
    print(row)   # ('BRCA1', 12, 50.0)

# 只取一条
cursor.execute('SELECT * FROM genes WHERE gene_id = "TP53"')
one = cursor.fetchone()
print(one)

conn.close()
```

---

#### 6. 条件筛选（`WHERE` 子句）—— 常用运算符

| 运算符 | 含义 | 示例 |
|--------|------|------|
| `=` | 等于 | `WHERE gene_id = 'BRCA1'` |
| `!=` 或 `<>` | 不等于 | `WHERE chromosome != '17'` |
| `>` `>=` `<` `<=` | 比较 | `WHERE length > 1000` |
| `LIKE` | 模式匹配（`%` 通配符） | `WHERE gene_id LIKE 'BR%'`（以BR开头） |
| `IN` | 在列表中 | `WHERE chromosome IN ('17', '8')` |
| `BETWEEN` | 区间 | `WHERE gc BETWEEN 40 AND 60` |
| `AND` / `OR` / `NOT` | 逻辑组合 | `WHERE length > 100 AND gc > 50` |
| `IS NULL` / `IS NOT NULL` | 空值判断 | `WHERE chromosome IS NOT NULL` |

示例：

```python
cursor.execute('''
SELECT gene_id, length, gc
FROM genes
WHERE gc > 60 AND chromosome = '17'
ORDER BY length DESC
''')
high_gc = cursor.fetchall()
```

---

#### 7. 聚合函数与分组（`GROUP BY`）

常用聚合函数：`COUNT`、`AVG`、`SUM`、`MAX`、`MIN`

统计每个染色体上的基因数量：

```python
cursor.execute('''
SELECT chromosome, COUNT(*) AS num_genes, AVG(gc) AS avg_gc
FROM genes
GROUP BY chromosome
''')
stats = cursor.fetchall()
for row in stats:
    print(f"染色体 {row[0]}: {row[1]} 个基因, 平均GC {row[2]:.2f}%")
```

带 `HAVING` 过滤分组结果（类似 `WHERE` 但用于分组后）：

```python
cursor.execute('''
SELECT chromosome, AVG(length) AS avg_len
FROM genes
GROUP BY chromosome
HAVING avg_len > 1000
''')
```

---

#### 8. 排序（`ORDER BY`）和限制（`LIMIT`）

```python
# 按长度降序，取前5名
cursor.execute('''
SELECT gene_id, length
FROM genes
ORDER BY length DESC
LIMIT 5
''')
top5 = cursor.fetchall()
```

---

#### 9. 多表连接（`JOIN`）—— 最强大的功能

假设有两个表：`genes`（基因信息）和 `expression`（表达量数据）。

创建表达量表：

```sql
CREATE TABLE expression (
    gene_id TEXT,
    tissue TEXT,
    expr_value REAL,
    PRIMARY KEY (gene_id, tissue)
);
```

插入几条表达数据。

内连接（`INNER JOIN`）查询基因序列和对应表达量：

```python
cursor.execute('''
SELECT g.gene_id, g.sequence, g.gc, e.tissue, e.expr_value
FROM genes g
INNER JOIN expression e ON g.gene_id = e.gene_id
WHERE e.tissue = 'liver' AND e.expr_value > 5.0
''')
```

左连接（`LEFT JOIN`）保留所有基因，即使没有表达数据：

```python
cursor.execute('''
SELECT g.gene_id, g.length, e.tissue, e.expr_value
FROM genes g
LEFT JOIN expression e ON g.gene_id = e.gene_id
''')
```

---

#### 10. 子查询（查询中嵌套查询）

查找长度大于平均长度的所有基因：

```python
cursor.execute('''
SELECT gene_id, length
FROM genes
WHERE length > (SELECT AVG(length) FROM genes)
''')
```

---

#### 11. 更新和删除数据（谨慎使用）

更新记录：

```python
cursor.execute('UPDATE genes SET gc = 55.0 WHERE gene_id = "BRCA1"')
conn.commit()
```

删除记录：

```python
cursor.execute('DELETE FROM genes WHERE gene_id = "EGFR"')
conn.commit()
```

**注意**：务必加上 `WHERE`，否则会清空整张表。

---

#### 12. 将 Biopython 解析的 FASTA 数据存入 SQLite（实战）

```python
from Bio import SeqIO
from Bio.SeqUtils import GC
import sqlite3

conn = sqlite3.connect("genes.db")
cursor = conn.cursor()

# 建表
cursor.execute('''
CREATE TABLE IF NOT EXISTS seqs (
    id TEXT PRIMARY KEY,
    seq TEXT,
    length INTEGER,
    gc REAL
)
''')

# 读取 FASTA 并插入
for record in SeqIO.parse("multi.fasta", "fasta"):
    seq_str = str(record.seq)
    gc_val = GC(record.seq)
    cursor.execute('''
    INSERT OR REPLACE INTO seqs (id, seq, length, gc)
    VALUES (?, ?, ?, ?)
    ''', (record.id, seq_str, len(seq_str), gc_val))

conn.commit()
conn.close()
```

`INSERT OR REPLACE` 如果主键已存在则覆盖。

---

#### 13. 用 SQL 查询筛选并导出为 CSV（结合 csv 模块）

```python
import sqlite3
import csv

conn = sqlite3.connect("genes.db")
cursor = conn.cursor()

cursor.execute('''
SELECT gene_id, length, gc
FROM genes
WHERE gc > 60
ORDER BY gc DESC
''')
rows = cursor.fetchall()

with open('high_gc_genes.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['gene_id', 'length', 'gc'])
    writer.writerows(rows)

conn.close()
```

---

#### 14. SQL 常用语句速查表（核心）

| 目的 | SQL 语句 |
|------|----------|
| 查所有列 | `SELECT * FROM 表名` |
| 查特定列 | `SELECT 列1, 列2 FROM 表名` |
| 条件筛选 | `SELECT * FROM 表名 WHERE 条件` |
| 排序 | `SELECT * FROM 表名 ORDER BY 列 ASC/DESC` |
| 限制行数 | `SELECT * FROM 表名 LIMIT n` |
| 分组统计 | `SELECT 列, COUNT(*) FROM 表名 GROUP BY 列` |
| 带条件分组 | `... HAVING 条件` |
| 两表连接 | `SELECT * FROM A JOIN B ON A.键 = B.键` |
| 插入数据 | `INSERT INTO 表名 (列1,列2) VALUES (值1,值2)` |
| 更新数据 | `UPDATE 表名 SET 列=新值 WHERE 条件` |
| 删除数据 | `DELETE FROM 表名 WHERE 条件` |
| 创建表 | `CREATE TABLE 表名 (列定义)` |
| 删除表 | `DROP TABLE 表名` |

---

#### 15. 在 Python 中管理数据库的最佳实践

- 使用 `with` 语句自动提交和关闭连接（需自定义上下文，或直接用 try/finally）

- 推荐使用 `conn.row_factory = sqlite3.Row` 以列名访问行

```python
conn = sqlite3.connect("genes.db")
conn.row_factory = sqlite3.Row
cursor = conn.cursor()
cursor.execute('SELECT gene_id, length FROM genes')
for row in cursor.fetchall():
    print(row['gene_id'], row['length'])
```

- 使用参数化查询（`?` 占位符）防止注入，并自动处理引号。

---

#### 16. 常见错误及解决（SQLite 专有）

| 错误信息 | 原因 | 解决 |
|----------|------|------|
| `sqlite3.OperationalError: no such table: xxx` | 表不存在 | 先执行 `CREATE TABLE` 或检查表名拼写 |
| `sqlite3.IntegrityError: UNIQUE constraint failed` | 主键重复插入 | 用 `INSERT OR REPLACE` 或先 `DELETE` 再插入 |
| `sqlite3.ProgrammingError: Incorrect number of bindings` | 占位符 `?` 数量与数据元组长度不匹配 | 检查传入的元组元素个数 |
| `sqlite3.OperationalError: near "SELECT": syntax error` | SQL 语句拼写错误 | 检查关键字（如 `SELECT` 写错），建议先在 SQLite 命令行测试 |
| 查询结果为空（`[]`） | 条件不满足或表为空 | 执行 `SELECT COUNT(*)` 确认有无数据 |

---

#### 17. 课后练习

1. 创建一个数据库 `annotation.db`，包含两张表：`genes`（id, name, chromosome, start, end）和 `exons`（exon_id, gene_id, exon_num, start, end）。用 SQL 插入几条示例数据。

2. 编写一个 SQL 查询，找出所有位于染色体 1 且长度大于 10000 的基因（利用 start 和 end 计算长度）。

3. 用 Python 的 `sqlite3` 从 FASTA 文件读取序列并存入表 `sequences`，同时计算 GC 含量和长度。

4. 写一个函数 `filter_by_gc(min_gc)`，从数据库中查询 GC 含量大于给定值的所有序列，返回一个列表，并导出为 FASTA 文件（用 `SeqIO.write`）。

5. 创建表达量表 `expression`（gene_id, tissue, fpkm），用 `JOIN` 连接 `genes` 和 `expression`，找出在肝脏中表达最高的 3 个基因，并显示它们的序列长度和 GC。

## 附录 3

### 第一课：从 SQL 到浏览器 —— 整体架构与前端三件套（HTML/CSS/JS）

本课目标：

- 理解“数据库 → 后端 API → 浏览器前端”的完整链路

- 认识 Cloudflare D1（云端 SQLite）、Cloudflare Workers（云端 JavaScript 运行环境）、GitHub（代码仓库）和 GitHub Pages（静态网站托管）

- 注册 GitHub 和 Cloudflare 账号（必须）

- 掌握 HTML 骨架、常用标签、表单元素

- 掌握 CSS 选择器、盒模型、Flexbox 常用布局

- 掌握 JavaScript 的 `fetch` 发起网络请求、DOM 操作（增删改查）、事件监听

---

#### 1. 整体架构（用一句话说清）

:::image center 000.jpg GitHub :::

:::image center 001.png Cloudflare :::

```
用户浏览器（你写的 HTML/CSS/JS）
        ↓
Cloudflare Worker（运行 JavaScript 的后端）
        ↓
Cloudflare D1（云端的 SQLite 数据库）
```

所有代码都跑在云端和浏览器，**不需要本地安装数据库或服务器**。

---

#### 2. 准备工作：注册账号（必须做）

**GitHub（存代码，托管前端）**

1. 打开 https://github.com

2. 点击 Sign up，用邮箱注册

3. 记住用户名和密码

**Cloudflare（存数据库，跑 Worker 后端）**

1. 打开 https://cloudflare.com

2. 点击 Sign up，用邮箱注册

3. 验证邮箱后登录

（后续课程中我们会把代码推送到 GitHub，并在 Cloudflare 上创建 D1 数据库和 Worker）

---

#### 3. HTML 骨架（每个页面都长这样）

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题</title>
</head>
<body>
    <!-- 所有可见内容写在这里 -->
</body>
</html>
```

**标签速查表（常用）**

| 标签 | 含义 | 示例 |
|------|------|------|
| `<h1>` ~ `<h6>` | 标题，1最大6最小 | `<h1>基因列表</h1>` |
| `<p>` | 段落 | `<p>这是说明文字</p>` |
| `<a href="url">` | 超链接 | `<a href="https://github.com">GitHub</a>` |
| `<img src="图片地址">` | 图片 | `<img src="logo.png">` |
| `<div>` | 块级容器（装其他标签） | `<div class="box">...</div>` |
| `<span>` | 行内容器 | `<span style="color:red">红色</span>` |
| `<ul>` / `<ol>` | 无序/有序列表 | `<ul><li>项目1</li></ul>` |
| `<table>` | 表格 | 见下方表格示例 |
| `<form>` | 表单 | 见下方输入示例 |
| `<input>` | 输入框 | `<input type="text" placeholder="输入基因名">` |
| `<button>` | 按钮 | `<button onclick="alert('hi')">点击</button>` |

**表格标签结构**：

```html
<table border="1">
    <thead>
        <tr><th>基因名</th><th>GC%</th></tr>
    </thead>
    <tbody>
        <tr><td>BRCA1</td><td>50.2</td></tr>
        <tr><td>TP53</td><td>62.5</td></tr>
    </tbody>
</table>
```

**表单示例（用于用户输入并提交）**：

```html
<form id="searchForm">
    <input type="text" id="geneInput" placeholder="输入基因名">
    <button type="submit">查询</button>
</form>
```

---

#### 4. CSS 快速入门（美化页面）

**三种写法（内联、内部、外部）**

内联（不推荐）：`<p style="color:blue;">文字</p>`

内部样式表（放在 `<head>` 中）：

```html
<style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; }
    .highlight { color: red; font-weight: bold; }
    #main { width: 80%; margin: auto; }
</style>
```

外部样式表（推荐，后续会用）：`<link rel="stylesheet" href="style.css">`

**选择器优先级速查**

| 选择器 | 写法 | 权重 |
|--------|------|------|
| 标签 | `div` | 低 |
| 类（class） | `.box` | 中 |
| ID | `#header` | 高 |
| 属性 | `[type="text"]` | 同class |

**盒模型（重点）**：每个元素都是矩形，从内到外：`内容` → `padding`（内边距）→ `border`（边框）→ `margin`（外边距）

```css
.box {
    width: 200px;
    padding: 10px;
    border: 1px solid #ccc;
    margin: 20px auto;   /* auto 居中 */
}
```

**Flexbox 布局（用来排列盒子，替代浮动）**

常用属性（父容器上）：

```css
.container {
    display: flex;
    flex-direction: row;      /* 水平排列（默认）| column 垂直 */
    justify-content: center;  /* 主轴居中 | flex-start | space-between */
    align-items: center;      /* 交叉轴居中 */
    gap: 10px;                /* 子元素间距 */
}
```

子元素上：`flex: 1`（均匀占满剩余空间）

---

#### 5. JavaScript 基础（让页面能动）

**变量（`let` / `const` / `var`）**：

```javascript
let name = "BRCA1";        // 可变
const GC = 50.2;           // 不可变
var old = "不推荐";        // 忽略
```

**数据类型（与Python类似）**：`string`, `number`, `boolean`, `array`（列表）, `object`（字典/对象）

```javascript
let genes = ["BRCA1", "TP53", "EGFR"];
let info = { id: "BRCA1", gc: 50.2, length: 1200 };
console.log(info.id);      // 访问属性用 . 或 []
```

**函数定义**：

```javascript
// 方式1
function add(a, b) { return a + b; }

// 方式2（箭头函数，常用）
const multiply = (a, b) => a * b;
```

**条件与循环**（与Python类似但语法不同）：

```javascript
if (gc > 60) {
    console.log("高GC");
} else if (gc > 40) {
    console.log("中等GC");
} else {
    console.log("低GC");
}

for (let i = 0; i < genes.length; i++) {
    console.log(genes[i]);
}

// 更简洁的 for-of
for (let g of genes) {
    console.log(g);
}
```

**DOM 操作（增删改查页面元素）**

| 操作 | 代码 |
|------|------|
| 通过 ID 获取元素 | `document.getElementById("geneInput")` |
| 通过类名获取（返回数组） | `document.getElementsByClassName("item")` |
| 通过选择器获取第一个 | `document.querySelector(".box")` |
| 通过选择器获取全部 | `document.querySelectorAll("div")` |
| 修改内容 | `element.textContent = "新文字"` |
| 修改 HTML | `element.innerHTML = "<b>加粗</b>"` |
| 修改样式 | `element.style.color = "red"` |
| 添加类 | `element.classList.add("active")` |
| 删除类 | `element.classList.remove("hidden")` |
| 创建元素 | `document.createElement("div")` |
| 添加子元素 | `parent.appendChild(newDiv)` |
| 删除子元素 | `parent.removeChild(child)` |

**事件监听（按钮点击、表单提交等）**：

```javascript
// 方式1：onclick 属性（不推荐）
// <button onclick="doSomething()">点我</button>

// 方式2：addEventListener（推荐）
const btn = document.getElementById("myBtn");
btn.addEventListener("click", function(event) {
    alert("按钮被点击了！");
    console.log(event.target);  // 触发事件的元素
});

// 表单提交事件（阻止页面刷新）
const form = document.getElementById("searchForm");
form.addEventListener("submit", function(e) {
    e.preventDefault();   // 阻止页面跳转
    const input = document.getElementById("geneInput");
    const value = input.value;
    console.log("用户搜索：", value);
    // 后续会用 fetch 发到 Worker
});
```

---

#### 6. JavaScript 的 `fetch` —— 调用后端 API（核心）

`fetch` 用于从浏览器向后端（Worker）发请求。

```javascript
// GET 请求（获取数据）
fetch("https://你的-worker.workers.dev/api/genes")
    .then(response => response.json())   // 把返回体解析为 JSON
    .then(data => {
        console.log(data);   // data 就是 JavaScript 对象/数组
        // 在这里用 DOM 操作把数据显示到页面上
    })
    .catch(error => console.error("请求失败：", error));

// POST 请求（发送数据）
fetch("https://你的-worker.workers.dev/api/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "BRCA1", gc: 50.2 })
})
.then(res => res.json())
.then(result => console.log(result));
```

**`async/await` 写法（更清晰，推荐）**：

```javascript
async function loadGenes() {
    try {
        const response = await fetch("/api/genes");
        if (!response.ok) throw new Error("网络错误");
        const data = await response.json();
        // 处理 data
    } catch (error) {
        console.error(error);
    }
}
```

（后续 Worker 课程中我们会创建这些 `/api/...` 端点）

---

#### 7. 完整示例：静态页面 + 纯前端表格渲染（先不用后端）

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>基因列表</title>
    <style>
        body { font-family: Arial; max-width: 800px; margin: auto; padding: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background: #f0f0f0; }
        #status { color: blue; margin: 10px 0; }
        input, button { padding: 8px; margin: 4px; }
    </style>
</head>
<body>

    <h1>基因浏览器</h1>
    <div>
        <input type="text" id="geneInput" placeholder="输入基因名">
        <button id="addBtn">添加示例基因</button>
    </div>
    <div id="status">等待操作...</div>
    <table>
        <thead><tr><th>ID</th><th>GC%</th></tr></thead>
        <tbody id="tableBody">
            <!-- 由 JavaScript 动态填充 -->
        </tbody>
    </table>

    <script>
        // 模拟数据（之后会替换为 fetch 从 Worker 获取）
        let genes = [
            { id: "BRCA1", gc: 50.2 },
            { id: "TP53", gc: 62.5 },
            { id: "EGFR", gc: 48.0 }
        ];

        function renderTable() {
            const tbody = document.getElementById("tableBody");
            tbody.innerHTML = "";  // 清空
            for (let g of genes) {
                const tr = document.createElement("tr");
                const td1 = document.createElement("td");
                td1.textContent = g.id;
                const td2 = document.createElement("td");
                td2.textContent = g.gc + "%";
                tr.appendChild(td1);
                tr.appendChild(td2);
                tbody.appendChild(tr);
            }
            document.getElementById("status").textContent = `共 ${genes.length} 个基因`;
        }

        // 添加示例基因（模拟）
        document.getElementById("addBtn").addEventListener("click", function() {
            const input = document.getElementById("geneInput");
            const name = input.value.trim();
            if (!name) {
                alert("请输入基因名");
                return;
            }
            // 模拟添加（随机GC）
            const newGene = { id: name, gc: (Math.random() * 50 + 30).toFixed(1) };
            genes.push(newGene);
            renderTable();
            input.value = "";
        });

        // 初始渲染
        renderTable();
    </script>
</body>
</html>
```

**保存为 `index.html`，用浏览器双击打开即可看到效果**（完全本地运行，无需网络）。

---

#### 8. 常见错误及调试（前端专有）

| 错误现象 | 常见原因 | 解决办法 |
|----------|----------|----------|
| 页面空白 | HTML 标签未闭合或引号缺失 | 检查浏览器的开发者工具（F12）Console 查看报错 |
| `Uncaught TypeError: Cannot read properties of null` | `getElementById` 没找到元素（可能ID写错，或脚本在元素前执行） | 把 `<script>` 放在 `</body>` 前，或使用 `DOMContentLoaded` 事件 |
| `fetch` 请求被 CORS 拦截 | 跨域问题 | Worker 需设置 `Access-Control-Allow-Origin`（后续课程会讲） |
| `JSON.parse` 报错 | 后端返回的不是合法 JSON | 用 `response.text()` 先查看原始返回值 |
| 点击按钮页面刷新 | `button` 在 `form` 内且未阻止默认行为 | 给 `submit` 事件加 `e.preventDefault()` |

---

#### 9. 本课小结（记忆点）

- **HTML**：骨架 + 标签（div, table, input, button）

- **CSS**：选择器 + 盒模型 + Flexbox

- **JS**：变量、函数、DOM操作、`fetch`、事件监听

- **调试**：永远用 F12 开发者工具看 Console 和 Network

---

#### 10. 课后练习（全部在浏览器中完成）

1. 创建一个 `index.html`，包含一个标题、一张表格、一个按钮。

2. 写 CSS 让表格每行鼠标悬停时变色（用 `:hover`）。

3. 写一个 JS 函数，点击按钮后在表格末尾添加一行新数据（内容固定即可）。

4. 修改上述完整示例，增加一列“长度”，并随机生成长度值。

5. （选做）用 `setInterval` 每隔 5 秒自动在 Console 打印当前基因列表的长度。

### 第二课：Cloudflare D1 数据库 —— 在云端创建你的第一个 SQLite 数据库

本课目标：

- 理解 D1 是什么（云端的 SQLite，免费额度够用）

- 在 Cloudflare Dashboard 中创建 D1 数据库

- 在 D1 中创建表（genes 表）

- 用 D1 的 Web 控制台执行 SQL（插入、查询、删除）

- 将 Worker 绑定到 D1 数据库（让 Worker 能读写数据库）

- 在 Worker 中编写 JavaScript 代码查询 D1

- 用 `fetch` 从浏览器前端调用 Worker 的 API

---

#### 1. D1 是什么（一句话）

D1 是 Cloudflare 提供的**云端 SQLite 数据库**，支持标准 SQL 语法，免费版提供 5GB 存储和每天 500 万次读取[reference:0]。你不需要安装任何东西，所有操作在浏览器中完成。

---

#### 2. 在 Cloudflare Dashboard 中创建 D1 数据库

**步骤 1：登录 Cloudflare**

打开 https://dash.cloudflare.com ，用之前注册的账号登录。

**步骤 2：进入 D1 页面**

- 左侧菜单找到 **Storage & Databases** → 点击 **D1** [reference:1]

- 或者直接在顶部搜索框输入 "D1"

**步骤 3：创建数据库**

- 点击 **Create database** 按钮[reference:2]

- 输入数据库名称，例如 `gene_db`

- （可选）选择地理位置，保持默认即可

- 点击 **Create** 按钮

创建完成后，你会看到数据库的详情页面，包含：

- **Database ID**（一串 UUID，后续绑定需要用到）

- **Name**（你起的名字）

---

#### 3. 在 D1 中创建表（通过 Web 控制台）

**步骤 1：进入 SQL 控制台**

在 D1 数据库详情页面，点击 **Console** 选项卡（或 **Query** 按钮）。

**步骤 2：执行建表 SQL**

在控制台中输入以下 SQL：

```sql
CREATE TABLE IF NOT EXISTS genes (
    id TEXT PRIMARY KEY,
    sequence TEXT,
    length INTEGER,
    gc REAL,
    chromosome TEXT
);
```

点击 **Run** 或 **Execute** 执行。

**验证表是否创建成功**：

```sql
SELECT name FROM sqlite_master WHERE type='table';
```

应该能看到 `genes` 出现在结果中。

---

#### 4. 在 D1 中插入和查询数据（Web 控制台练习）

**插入一条数据**：

```sql
INSERT INTO genes (id, sequence, length, gc, chromosome)
VALUES ('BRCA1', 'ATCGATCGATCG', 12, 50.0, '17');
```

**插入多条数据**：

```sql
INSERT INTO genes (id, sequence, length, gc, chromosome) VALUES
('TP53', 'GCATGCATGCAT', 12, 50.0, '17'),
('EGFR', 'ATATATATATAT', 12, 25.0, '7'),
('MYC', 'GCCGCCGCCGCC', 12, 75.0, '8');
```

**查询所有数据**：

```sql
SELECT * FROM genes;
```

**条件查询**：

```sql
SELECT id, gc FROM genes WHERE gc > 60;
```

**删除数据**：

```sql
DELETE FROM genes WHERE id = 'EGFR';
```

**清空表（谨慎）** ：

```sql
DELETE FROM genes;
```

---

#### 5. D1 控制台 SQL 速查表

| 操作 | SQL 语句 |
|------|----------|
| 创建表 | `CREATE TABLE 表名 (列定义)` |
| 插入 | `INSERT INTO 表名 VALUES (...)` |
| 查询全部 | `SELECT * FROM 表名` |
| 条件查询 | `SELECT * FROM 表名 WHERE 条件` |
| 更新 | `UPDATE 表名 SET 列=值 WHERE 条件` |
| 删除 | `DELETE FROM 表名 WHERE 条件` |
| 删除表 | `DROP TABLE 表名` |

---

#### 6. 创建 Cloudflare Worker（后端 API）

Worker 就是运行在 Cloudflare 边缘节点的 JavaScript 程序，可以响应 HTTP 请求并操作 D1 数据库。

**步骤 1：进入 Workers & Pages**

- 左侧菜单点击 **Workers & Pages**

**步骤 2：创建 Worker**

- 点击 **Create application**[reference:4]

- 选择 **Create Worker**

- 输入 Worker 名称，例如 `gene-api`

- 点击 **Deploy** 按钮

创建完成后，你会看到一个默认的 "Hello World" Worker。

**步骤 3：进入在线编辑器**

在 Worker 详情页面，点击 **Edit code** 按钮。这会打开一个浏览器版的代码编辑器（类似 VS Code）。

---

#### 7. 将 Worker 绑定到 D1 数据库（最关键的一步）

绑定后，Worker 中的代码就能通过 `env.DB` 访问 D1 数据库。

**步骤 1：进入 Worker 的设置**

- 在 Worker 详情页面，点击顶部的 **Settings** 选项卡[reference:7]

**步骤 2：进入 Variables**

- 点击左侧或页面中的 **Variables** 子选项卡[reference:8]

**步骤 3：添加 D1 数据库绑定**

- 滚动到 **D1 Database Bindings** 区域[reference:9]

- 点击 **Add binding**

- **Variable name** 输入 `DB`（这是你在代码中使用的变量名）[reference:11]

- **D1 database** 选择你之前创建的 `gene_db`

- 点击 **Save and deploy**

绑定完成后，Worker 就拥有了访问 `gene_db` 的权限。

---

#### 8. 在 Worker 中编写查询 D1 的代码

在在线编辑器中，将 `src/index.js`（或 `index.js`）的内容替换为以下代码：

```javascript
export default {
    async fetch(request, env, ctx) {
        // 解析 URL，判断请求路径
        const url = new URL(request.url);
        const path = url.pathname;

        // 处理 CORS（允许前端跨域请求）
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // 处理 OPTIONS 预检请求
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // GET /api/genes —— 查询所有基因
        if (path === '/api/genes' && request.method === 'GET') {
            try {
                const { results } = await env.DB.prepare(
                    'SELECT * FROM genes ORDER BY gc DESC'
                ).all();
                return new Response(JSON.stringify(results), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: error.message }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }

        // GET /api/genes/:id —— 查询单个基因
        if (path.startsWith('/api/genes/') && request.method === 'GET') {
            const id = path.split('/')[3];
            try {
                const result = await env.DB.prepare(
                    'SELECT * FROM genes WHERE id = ?'
                ).bind(id).first();
                if (!result) {
                    return new Response(JSON.stringify({ error: '基因不存在' }), {
                        status: 404,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }
                return new Response(JSON.stringify(result), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: error.message }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }

        // POST /api/genes —— 添加新基因
        if (path === '/api/genes' && request.method === 'POST') {
            try {
                const body = await request.json();
                const { id, sequence, length, gc, chromosome } = body;
                if (!id || !sequence) {
                    return new Response(JSON.stringify({ error: 'id 和 sequence 是必填的' }), {
                        status: 400,
                        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                    });
                }
                await env.DB.prepare(
                    'INSERT INTO genes (id, sequence, length, gc, chromosome) VALUES (?, ?, ?, ?, ?)'
                ).bind(id, sequence, length || 0, gc || 0, chromosome || '').run();
                return new Response(JSON.stringify({ success: true, id }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: error.message }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }

        // DELETE /api/genes/:id —— 删除基因
        if (path.startsWith('/api/genes/') && request.method === 'DELETE') {
            const id = path.split('/')[3];
            try {
                await env.DB.prepare('DELETE FROM genes WHERE id = ?').bind(id).run();
                return new Response(JSON.stringify({ success: true, id }), {
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            } catch (error) {
                return new Response(JSON.stringify({ error: error.message }), {
                    status: 500,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }

        // 默认返回 404
        return new Response(JSON.stringify({ error: '接口不存在' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    },
};
```

**代码解释**：

- `env.DB` 就是你在绑定中设置的变量名，通过它访问 D1 数据库[reference:13]

- `prepare('SQL语句')` 准备一条 SQL 语句[reference:14]

- `.bind(值1, 值2, ...)` 绑定参数（防止 SQL 注入）[reference:15]

- `.all()` 执行查询并返回所有行

- `.first()` 执行查询并返回第一行

- `.run()` 执行插入/更新/删除

---

#### 9. 保存并部署 Worker

- 点击编辑器右上角的 **Save and Deploy** 按钮

- 等待几秒钟，部署完成

- 你会获得一个 Worker 的 URL，类似 `https://gene-api.你的用户名.workers.dev`

---

#### 10. 测试 Worker API（用浏览器直接访问）

打开浏览器，访问以下地址（替换成你自己的 Worker URL）：

```
https://gene-api.你的用户名.workers.dev/api/genes
```

如果一切正常，你会看到数据库中所有基因的 JSON 数据。

**测试单个查询**：

```
https://gene-api.你的用户名.workers.dev/api/genes/BRCA1
```

**测试 POST（用浏览器的开发者工具 Console）** ：

```javascript
fetch('https://gene-api.你的用户名.workers.dev/api/genes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        id: 'NEWGENE',
        sequence: 'ATCGATCGATCG',
        length: 12,
        gc: 50.0,
        chromosome: '1'
    })
})
.then(r => r.json())
.then(console.log);
```

---

#### 11. Worker 中 D1 操作速查表

| 操作 | 代码 |
|------|------|
| 查询所有行 | `await env.DB.prepare('SELECT * FROM 表').all()` |
| 查询第一行 | `await env.DB.prepare('SELECT * FROM 表 WHERE id=?').bind(id).first()` |
| 插入 | `await env.DB.prepare('INSERT INTO 表 VALUES (?,?)').bind(a,b).run()` |
| 更新 | `await env.DB.prepare('UPDATE 表 SET 列=? WHERE id=?').bind(val,id).run()` |
| 删除 | `await env.DB.prepare('DELETE FROM 表 WHERE id=?').bind(id).run()` |

---

#### 12. 常见错误及解决（D1 + Worker 专有）

| 错误现象 | 常见原因 | 解决办法 |
|----------|----------|----------|
| `D1_ERROR: no such table: genes` | 表不存在 | 在 D1 控制台执行 `CREATE TABLE` |
| `D1_ERROR: UNIQUE constraint failed` | 主键重复插入 | 用 `INSERT OR REPLACE` 或先 DELETE |
| `TypeError: env.DB is undefined` | Worker 未绑定 D1 | 检查 Settings → Variables → D1 Database Bindings |
| `CORS policy` 报错 | 跨域被拦截 | Worker 代码中已添加 CORS 头，检查是否部署成功 |
| `404 Not Found` | 路径写错 | 检查 URL 路径是否为 `/api/genes` |
| 返回 `{"error":...}` | SQL 语句语法错误 | 检查 SQL 中的表名和列名是否正确 |

---

#### 13. 本课小结

- **D1** = 云端的 SQLite，在 Dashboard 中创建和管理

- **Worker** = 运行在云端的 JavaScript，响应 HTTP 请求

- **绑定** = 让 Worker 能访问 D1（Settings → Variables → D1 Database Bindings）

- **API 路由** = Worker 中根据 URL 路径执行不同的 SQL 操作

---

#### 14. 课后练习

1. 在 D1 控制台中创建一个 `samples` 表（字段：id, name, value），插入 3 条数据。

2. 修改 Worker 代码，增加一个 `/api/samples` 接口返回 `samples` 表的所有数据。

3. 用浏览器访问 `/api/samples`，验证能看到数据。

4. 增加一个 POST 接口 `/api/samples`，允许通过 JSON 添加新样本。

5. （选做）增加一个 PUT 接口 `/api/samples/:id`，允许更新指定样本的 value。

### 第三课：网页三剑客语法深度解析 —— 从标签到交互的所有核心知识

本课目标：

- 掌握 HTML 所有常用标签及其属性（表格、表单、链接、图片、语义化标签）

- 掌握 CSS 选择器、盒模型、定位、Flexbox、Grid 布局（含完整属性表）

- 掌握 JavaScript 核心语法（变量、函数、数组方法、对象、解构、模板字符串）

- 掌握 DOM 操作的全部常用方法（增删改查、属性操作、样式操作）

- 掌握事件模型（事件流、事件委托、常见事件类型）

- 掌握 fetch API 的完整用法（GET、POST、PUT、DELETE，错误处理，async/await）

- 掌握 JSON 序列化与反序列化

---

#### 1. HTML 标签完整速查表（按功能分类）

**文档结构标签**

| 标签 | 作用 |
|------|------|
| `<!DOCTYPE html>` | 文档类型声明 |
| `<html>` | 根元素 |
| `<head>` | 头部信息（元数据、样式、脚本） |
| `<body>` | 可见内容 |
| `<meta>` | 字符编码、视口等 |
| `<title>` | 浏览器标签栏标题 |

**文本内容标签**

| 标签 | 作用 | 示例 |
|------|------|------|
| `<h1>` ~ `<h6>` | 标题 | `<h1>主标题</h1>` |
| `<p>` | 段落 | `<p>文字段落</p>` |
| `<br>` | 换行（单标签） | `第一行<br>第二行` |
| `<hr>` | 水平分割线 | `<hr>` |
| `<strong>` / `<b>` | 加粗（strong表示强调） | `<strong>重要</strong>` |
| `<em>` / `<i>` | 斜体 | `<em>强调</em>` |
| `<span>` | 行内容器（用于包裹部分文字） | `<span style="color:red">红字</span>` |
| `<div>` | 块级容器（布局用） | `<div class="container">...</div>` |

**链接与图片**

| 标签 | 属性 | 作用 |
|------|------|------|
| `<a>` | `href="url"`, `target="_blank"`（新窗口） | 超链接 |
| `<img>` | `src="图片路径"`, `alt="替代文本"`, `width/height` | 图片 |

**列表**

| 标签 | 作用 |
|------|------|
| `<ul>` | 无序列表（`<li>` 子项） |
| `<ol>` | 有序列表（`<li>` 子项） |
| `<li>` | 列表项 |

**表格（完整结构）**

```html
<table border="1" cellpadding="5">
    <caption>表标题（可选）</caption>
    <thead>
        <tr><th>列头1</th><th>列头2</th></tr>
    </thead>
    <tbody>
        <tr><td>数据1</td><td>数据2</td></tr>
    </tbody>
    <tfoot>
        <tr><td colspan="2">表尾</td></tr>
    </tfoot>
</table>
```

**表单元素（核心）**

| 标签 | 常用属性 | 说明 |
|------|----------|------|
| `<form>` | `action`, `method`（GET/POST） | 表单容器 |
| `<input>` | `type`（text, password, number, checkbox, radio, file, date等）, `value`, `placeholder`, `required` | 输入控件 |
| `<textarea>` | `rows`, `cols` | 多行文本 |
| `<select>` | 包含 `<option>` | 下拉菜单 |
| `<button>` | `type`（submit, button, reset） | 按钮 |
| `<label>` | `for` 指向输入框的 id | 标签（点击聚焦输入框） |

示例：

```html
<form id="myForm">
    <label for="name">基因名：</label>
    <input type="text" id="name" placeholder="输入名称" required>
    <br>
    <label for="gc">GC含量：</label>
    <input type="number" id="gc" step="0.1" min="0" max="100">
    <br>
    <button type="submit">提交</button>
</form>
```

**语义化标签（HTML5）**：`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>` —— 用于提高可读性和 SEO，功能等同于 `<div>`，但更清晰。

---

#### 2. CSS 选择器完整表

| 选择器 | 写法 | 示例 | 说明 |
|--------|------|------|------|
| 标签选择器 | `标签名` | `div { }` | 所有 div |
| 类选择器 | `.类名` | `.box { }` | 所有 class="box" 的元素 |
| ID 选择器 | `#id` | `#header { }` | 唯一 id 的元素 |
| 通配符 | `*` | `* { margin:0; }` | 所有元素 |
| 后代选择器 | `A B`（空格） | `div p { }` | div 内的所有 p |
| 子选择器 | `A > B` | `div > p { }` | div 的直接子 p |
| 相邻兄弟 | `A + B` | `h1 + p { }` | 紧跟在 h1 后的 p |
| 属性选择器 | `[属性]` 或 `[属性=值]` | `input[type="text"] { }` | 指定属性的元素 |
| 伪类 | `:hover`, `:nth-child`, `:first-child` | `tr:hover { }` | 鼠标悬停等状态 |
| 伪元素 | `::before`, `::after` | `p::first-line { }` | 某部分内容 |

**常用 CSS 属性速查**

| 类别 | 属性 | 取值示例 |
|------|------|----------|
| 文字 | `color`, `font-size`, `font-family`, `font-weight`, `text-align` | `color:red; font-size:16px; font-weight:bold; text-align:center;` |
| 背景 | `background-color`, `background-image`, `background-size` | `background:#f0f0f0;` |
| 尺寸 | `width`, `height`, `min-width`, `max-width` | `width:100%; max-width:800px;` |
| 边距 | `margin`（外）, `padding`（内） | `margin:10px auto; padding:20px;`（auto 水平居中） |
| 边框 | `border`, `border-radius`（圆角） | `border:1px solid #ccc; border-radius:8px;` |
| 显示 | `display`（block, inline, flex, grid, none） | `display:flex;` |
| 定位 | `position`（relative, absolute, fixed）, `top`, `left`, `z-index` | `position:fixed; top:0;` |

**Flexbox 常用属性（父容器）**

| 属性 | 取值 | 作用 |
|------|------|------|
| `display: flex;` | 启用 flex 布局 |
| `flex-direction` | `row`（默认）, `column`, `row-reverse`, `column-reverse` | 主轴方向 |
| `justify-content` | `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly` | 主轴对齐 |
| `align-items` | `flex-start`, `flex-end`, `center`, `stretch`, `baseline` | 交叉轴对齐 |
| `flex-wrap` | `nowrap`（默认）, `wrap`, `wrap-reverse` | 是否换行 |
| `gap` | 数值 | 子元素间距 |

**Flexbox 常用属性（子元素）**

| 属性 | 作用 |
|------|------|
| `flex: 1;` | 按比例分配剩余空间（如 `flex: 2;` 占两份） |
| `align-self: center;` | 单独设置该子元素的交叉轴对齐 |
| `order: 1;` | 调整排序（数字越大越靠后） |

**Grid 布局（两行代码入门）**

```css
.container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;  /* 三列等宽 */
    grid-gap: 10px;
}
/* 或更灵活：grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); */
```

---

#### 3. JavaScript 核心语法深度表

**变量声明**

| 关键字 | 作用域 | 可修改 | 可重新声明 | 推荐 |
|--------|--------|--------|------------|------|
| `var` | 函数作用域 | 是 | 是 | 不推荐 |
| `let` | 块作用域（{}内） | 是 | 否 | 常用 |
| `const` | 块作用域 | 否（引用不可变，但对象内容可改） | 否 | 优先使用 |

**基本数据类型**

| 类型 | 说明 | 示例 |
|------|------|------|
| `string` | 字符串（单引号/双引号/反引号） | `"BRCA1"`, `'TP53'`, `` `基因名：${name}` `` |
| `number` | 整数和浮点数 | `50.2`, `1200` |
| `boolean` | true / false | `true`, `false` |
| `null` | 空值（主动赋值） | `let x = null;` |
| `undefined` | 未定义（声明未赋值） | `let y;`（y === undefined） |
| `object` | 对象（包括数组、函数、普通对象） | `{id:'BRCA1', gc:50.2}`, `[1,2,3]` |
| `symbol` | 唯一标识符（了解即可） | `Symbol('key')` |

**类型检测**：`typeof` 运算符（`typeof 123` → `"number"`）

**字符串模板（反引号 + ${}）**：

```javascript
const gene = 'BRCA1';
const gc = 50.2;
console.log(`基因 ${gene} 的 GC 含量为 ${gc}%`);   // 基因 BRCA1 的 GC 含量为 50.2%
```

**数组常用方法（增删改查）**

| 方法 | 作用 | 示例 | 是否修改原数组 |
|------|------|------|----------------|
| `push(x)` | 末尾添加 | `arr.push(5)` | 是 |
| `pop()` | 删除末尾并返回 | `arr.pop()` | 是 |
| `unshift(x)` | 开头添加 | `arr.unshift(0)` | 是 |
| `shift()` | 删除开头并返回 | `arr.shift()` | 是 |
| `splice(i, n)` | 从 i 删除 n 个 | `arr.splice(1,2)` | 是 |
| `slice(i, j)` | 切片（不修改） | `arr.slice(1,3)` | 否 |
| `concat(arr2)` | 合并 | `arr.concat([4,5])` | 否 |
| `join(sep)` | 连接为字符串 | `arr.join(',')` | 否 |
| `indexOf(x)` | 查找索引 | `arr.indexOf(3)` | 否 |
| `includes(x)` | 是否包含 | `arr.includes(2)` | 否 |
| `forEach(callback)` | 遍历 | `arr.forEach(v => console.log(v))` | 否 |
| `map(callback)` | 映射为新数组 | `arr.map(v => v*2)` | 否 |
| `filter(callback)` | 过滤 | `arr.filter(v => v>2)` | 否 |
| `find(callback)` | 查找第一个匹配元素 | `arr.find(v => v>2)` | 否 |
| `reduce(callback, init)` | 累加/归约 | `arr.reduce((sum,v) => sum+v, 0)` | 否 |

**对象操作**

```javascript
const obj = { id: 'BRCA1', gc: 50.2 };
// 访问属性
obj.id        // 'BRCA1'
obj['gc']     // 50.2
// 修改/新增
obj.length = 1200;
delete obj.gc;   // 删除属性
// 遍历键值
for (let key in obj) { console.log(key, obj[key]); }
// 获取所有键/值
Object.keys(obj);   // ['id','length']
Object.values(obj); // ['BRCA1', 1200]
Object.entries(obj); // [['id','BRCA1'], ['length',1200]]
// 解构赋值
const { id, length } = obj;   // id='BRCA1', length=1200
```

**函数进阶**

- 默认参数：`function greet(name = '匿名') { ... }`

- 剩余参数：`function sum(...numbers) { return numbers.reduce((a,b)=>a+b); }`

- 箭头函数不绑定 `this`，在事件回调中需注意，通常用普通函数或 bind。

---

#### 4. DOM 操作完整方法表

**获取元素**

| 方法 | 返回 |
|------|------|
| `document.getElementById('id')` | 单个元素 |
| `document.querySelector('选择器')` | 第一个匹配元素 |
| `document.querySelectorAll('选择器')` | NodeList（类数组） |
| `document.getElementsByClassName('cls')` | HTMLCollection（动态） |
| `document.getElementsByTagName('div')` | HTMLCollection |

**修改内容/属性**

| 操作 | 示例 |
|------|------|
| `element.textContent = '新文本'` | 纯文本 |
| `element.innerHTML = '<b>HTML</b>'` | HTML 字符串 |
| `element.setAttribute('data-id', '123')` | 设置属性 |
| `element.getAttribute('data-id')` | 获取属性 |
| `element.removeAttribute('data-id')` | 删除属性 |
| `element.value = '输入内容'` | 表单值 |

**修改样式**

- 内联样式：`element.style.color = 'red'; element.style.display = 'none';`

- 类操作：`element.classList.add('active')`，`.remove('hidden')`，`.toggle('show')`，`.contains('cls')`

**创建与插入**

| 方法 | 作用 |
|------|------|
| `document.createElement('div')` | 创建新元素 |
| `document.createTextNode('文本')` | 创建文本节点 |
| `parent.appendChild(child)` | 末尾添加子节点 |
| `parent.insertBefore(child, ref)` | 在 ref 之前插入 |
| `parent.replaceChild(new, old)` | 替换子节点 |
| `parent.removeChild(child)` | 删除子节点 |
| `element.remove()` | 直接删除自身（现代） |

**遍历节点**

```javascript
const parent = document.getElementById('container');
for (let child of parent.children) { // 只含元素节点
    console.log(child.tagName);
}
// 或使用 parent.querySelectorAll('*') 获取所有后代
```

---

#### 5. 事件处理详解

**添加事件监听**

```javascript
element.addEventListener('click', function(event) {
    // event 是事件对象
    console.log(event.target);   // 触发事件的元素
    console.log(event.type);     // 'click'
});
```

**常用事件类型**

| 类型 | 触发时机 |
|------|----------|
| `click` | 单击 |
| `dblclick` | 双击 |
| `mouseenter` / `mouseleave` | 鼠标进入/离开 |
| `mousemove` | 鼠标移动 |
| `keydown` / `keyup` | 键盘按下/弹起 |
| `input` | 输入框内容变化（实时） |
| `change` | 表单值改变（失去焦点时） |
| `submit` | 表单提交 |
| `load` | 页面/图片加载完成 |
| `DOMContentLoaded` | DOM 结构加载完成（不等待图片） |
| `scroll` | 滚动 |
| `resize` | 窗口大小改变 |

**阻止默认行为与冒泡**

```javascript
element.addEventListener('click', function(e) {
    e.preventDefault();   // 阻止链接跳转或表单提交
    e.stopPropagation();  // 阻止事件冒泡到父元素
});
```

**事件委托（利用冒泡）**：在父元素监听事件，通过 `e.target` 判断具体子元素。

```javascript
document.getElementById('list').addEventListener('click', function(e) {
    if (e.target.tagName === 'LI') {
        console.log('点击了列表项：', e.target.textContent);
    }
});
```

---

#### 6. fetch API 完全手册

**GET 请求**

```javascript
const response = await fetch('/api/genes');
if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
}
const data = await response.json();   // 解析为 JSON
// 或 const text = await response.text();   // 获取纯文本
```

**POST 请求（发送 JSON）**

```javascript
const newGene = { id: 'BRCA1', gc: 50.2 };
const response = await fetch('/api/genes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newGene)
});
const result = await response.json();
```

**PUT 请求（更新）**

```javascript
await fetch('/api/genes/BRCA1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gc: 55.0 })
});
```

**DELETE 请求**

```javascript
await fetch('/api/genes/BRCA1', { method: 'DELETE' });
```

**错误处理最佳实践**

```javascript
async function fetchData(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            // 尝试获取服务器返回的错误信息
            const errText = await res.text();
            throw new Error(`状态码 ${res.status}: ${errText}`);
        }
        return await res.json();
    } catch (error) {
        console.error('请求失败:', error);
        // 可显示用户友好的提示
        return null;
    }
}
```

**同时发送多个请求**（`Promise.all`）

```javascript
const [genes, expressions] = await Promise.all([
    fetch('/api/genes').then(r => r.json()),
    fetch('/api/expression').then(r => r.json())
]);
```

---

#### 7. JSON 操作

| 操作 | 方法 | 示例 |
|------|------|------|
| 对象 → JSON 字符串 | `JSON.stringify(obj)` | `JSON.stringify({a:1})` → '{"a":1}' |
| JSON 字符串 → 对象 | `JSON.parse(jsonStr)` | `JSON.parse('{"a":1}')` → {a:1} |

**注意**：`JSON.stringify` 会忽略函数和 undefined，处理循环引用会报错。

---

#### 8. 异步编程（回调 → Promise → async/await）

- **回调**：旧写法，会产生"回调地狱"

- **Promise**：`fetch().then().catch()`

- **async/await**：让异步代码像同步一样写（推荐）

```javascript
// Promise 链
function getGene(id) {
    return fetch(`/api/genes/${id}`)
        .then(res => res.json())
        .then(data => data)
        .catch(err => console.error(err));
}

// async/await 等价
async function getGene(id) {
    try {
        const res = await fetch(`/api/genes/${id}`);
        return await res.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}
```

---

#### 9. 前端调试必备（浏览器 F12）

- **Console**：打印日志、执行临时代码

- **Elements**：查看和修改 DOM 结构、样式

- **Network**：查看所有网络请求（fetch 请求、状态码、响应内容）

- **Sources**：设置断点调试 JavaScript

- **Application**：查看 LocalStorage、Cookie 等

常用调试语句：

```javascript
console.log('普通日志');
console.error('错误信息');
console.warn('警告');
console.table([{a:1}, {a:2}]);   // 表格显示数组
debugger;   // 在该行暂停（需打开开发者工具）
```

---

#### 10. 实战：整合前端页面（包含表单提交 + 表格渲染 + fetch 调用）

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>基因数据库前端</title>
    <style>
        body { font-family: Arial; max-width: 900px; margin: 30px auto; padding: 20px; background: #f9f9f9; }
        .container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; }
        .form-group { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
        .form-group input, .form-group button { padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; }
        .form-group button { background: #3498db; color: white; border: none; cursor: pointer; }
        .form-group button:hover { background: #2980b9; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #ecf0f1; }
        .delete-btn { background: #e74c3c; color: white; border: none; padding: 4px 10px; border-radius: 3px; cursor: pointer; }
        #status { margin: 10px 0; color: #27ae60; }
        .error { color: #e74c3c; }
    </style>
</head>
<body>
<div class="container">
    <h1>🧬 基因管理</h1>
    <div class="form-group">
        <input type="text" id="geneId" placeholder="基因ID（如 BRCA1）">
        <input type="text" id="geneSeq" placeholder="序列（ATCG...）">
        <input type="number" id="geneGc" placeholder="GC% (0-100)" step="0.1">
        <button id="addBtn">添加基因</button>
        <button id="refreshBtn">刷新列表</button>
    </div>
    <div id="status">加载中...</div>
    <table>
        <thead><tr><th>ID</th><th>序列</th><th>长度</th><th>GC%</th><th>染色体</th><th>操作</th></tr></thead>
        <tbody id="tableBody"></tbody>
    </table>
</div>

<script>
    // 配置后端 API 地址（部署后替换为你的 Worker URL）
    const API_BASE = 'https://gene-api.你的用户名.workers.dev/api/genes';

    // 获取所有基因并渲染表格
    async function loadGenes() {
        const status = document.getElementById('status');
        status.textContent = '加载中...';
        try {
            const res = await fetch(API_BASE);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            renderTable(data);
            status.textContent = `✅ 共 ${data.length} 个基因`;
        } catch (err) {
            status.textContent = `❌ 加载失败: ${err.message}`;
            status.className = 'error';
        }
    }

    // 渲染表格
    function renderTable(genes) {
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = '';
        if (!genes || genes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">暂无数据</td></tr>';
            return;
        }
        for (let g of genes) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${g.id}</td>
                <td>${g.sequence || ''}</td>
                <td>${g.length || 0}</td>
                <td>${g.gc || 0}</td>
                <td>${g.chromosome || ''}</td>
                <td><button class="delete-btn" data-id="${g.id}">删除</button></td>
            `;
            tbody.appendChild(tr);
        }
        // 绑定删除事件（事件委托）
        tbody.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const id = this.dataset.id;
                if (!confirm(`确定删除 ${id} 吗？`)) return;
                await deleteGene(id);
                loadGenes(); // 刷新列表
            });
        });
    }

    // 添加基因
    async function addGene(id, sequence, gc) {
        const status = document.getElementById('status');
        try {
            const res = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, sequence, length: sequence.length, gc: parseFloat(gc) || 0 })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || '添加失败');
            }
            status.textContent = `✅ 基因 ${id} 添加成功`;
            status.className = '';
        } catch (err) {
            status.textContent = `❌ ${err.message}`;
            status.className = 'error';
        }
    }

    // 删除基因
    async function deleteGene(id) {
        try {
            const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('删除失败');
        } catch (err) {
            alert(`删除失败: ${err.message}`);
        }
    }

    // 事件绑定
    document.getElementById('addBtn').addEventListener('click', async function() {
        const id = document.getElementById('geneId').value.trim();
        const seq = document.getElementById('geneSeq').value.trim();
        const gc = document.getElementById('geneGc').value;
        if (!id || !seq) {
            alert('ID 和序列不能为空');
            return;
        }
        await addGene(id, seq, gc);
        document.getElementById('geneId').value = '';
        document.getElementById('geneSeq').value = '';
        document.getElementById('geneGc').value = '';
        loadGenes(); // 刷新列表
    });

    document.getElementById('refreshBtn').addEventListener('click', loadGenes);

    // 初始加载
    loadGenes();
</script>
</body>
</html>
```

**注意**：将代码中的 `API_BASE` 替换为你部署后的 Worker 完整 URL（下一课会得到）。

---

#### 11. 常见错误及解决（前端代码错误）

| 错误 | 原因 | 解决 |
|------|------|------|
| `Uncaught ReferenceError: xxx is not defined` | 变量未声明或拼写错误 | 检查变量名，确保用 `let/const` 声明 |
| `Cannot read property 'xxx' of null` | 获取元素失败（id 写错或脚本执行过早） | 检查 id，把 `<script>` 放在 body 末尾或使用 `DOMContentLoaded` |
| `Unexpected token ')'` | 括号不匹配或中英文符号混用 | 检查所有括号，用英文标点 |
| `fetch failed` / `NetworkError` | 网络不通或 Worker URL 错误 | 检查 API_BASE，确保 Worker 已部署且开启 |
| `JSON.parse` 报错 | 后端返回的不是 JSON | 用 `await res.text()` 查看原始内容 |
| 点击按钮页面刷新 | 按钮在 form 内未阻止默认 | 给 submit 事件加 `e.preventDefault()`，或把按钮 type 设为 `button` |

---

#### 12. 本课小结（重点记忆）

- HTML 标签：`div, span, table, form, input, button, a, img` 最常用

- CSS 布局：Flexbox（`display:flex; justify-content:center; align-items:center;`）解决 90% 布局问题

- JS 核心：`let/const`, 箭头函数, 模板字符串, 解构, 数组方法（map/filter/find）

- DOM 操作：`querySelector`, `textContent`, `innerHTML`, `classList.add/remove`, `appendChild`

- 事件：`addEventListener`, `e.preventDefault()`, 事件委托

- Fetch：`await fetch(url, {method, headers, body})`, 错误处理, 解析 JSON

- 调试：F12 → Console / Network / Elements

---

#### 13. 课后练习

1. 用纯 HTML + CSS 画一个卡片布局，包含头像、标题、描述和按钮，使用 Flexbox 居中。

2. 写一个 JS 函数，接受一个数组（基因对象），渲染成表格，并增加一列显示序列长度（若没有 length 字段则计算字符串长度）。

3. 用 fetch 调用一个公共 API（如 https://api.github.com/users/octocat），将返回的 JSON 显示在页面上。

4. 修改上述完整示例，增加“更新”功能：双击表格行可弹出输入框修改 GC 值，然后发送 PUT 请求。

5. 实现在搜索框中输入关键词，过滤表格中显示的基因（纯前端过滤，不请求后端）。

### 第四课：部署前端到 GitHub Pages 与全链路联调（前端 → Worker → D1 上线）

本课目标：

- 在 GitHub 上创建仓库并推送本地代码（或直接在网页创建）

- 启用 GitHub Pages 托管静态 HTML 页面

- 获取线上前端地址，更新 Worker 中的 CORS 配置（或保持 `*`）

- 将前端 JavaScript 中的 API_BASE 改为线上 Worker 地址

- 完成“浏览器 → Worker API → D1 数据库”全链路测试

- 掌握 Git 基本命令（add, commit, push）

---

#### 1. 在 GitHub 上创建仓库（两种方式）

**方式一：网页直接创建（推荐新手）**

1. 登录 GitHub，点击右上角 **+** → **New repository**

2. Repository name 输入 `gene-browser`（或其他名字）

3. 选择 **Public**（公开，免费）

4. 勾选 **Add a README file**（可选）

5. 点击 **Create repository**

**方式二：命令行创建（需安装 Git）**

```bash
# 在本地项目文件夹中
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/你的用户名/gene-browser.git
git push -u origin main
```

---

#### 2. 准备前端文件（确保包含正确的 API 地址）

在你的项目文件夹中，创建 `index.html` 文件（内容使用第三课最后的完整示例）。

**关键修改**：将 `API_BASE` 的地址改为你的 Worker 地址。

```javascript
// 替换为你自己的 Worker 地址（从 Cloudflare 复制）
const API_BASE = 'https://gene-api.你的用户名.workers.dev/api/genes';
```

如果不确定 Worker 地址，打开 Cloudflare Dashboard → Workers & Pages → 点击你的 Worker `gene-api` → 在顶部可以看到 `https://gene-api.你的用户名.workers.dev`。

---

#### 3. 将代码推送到 GitHub（网页上传方式，无需 Git 命令行）

如果你不想用命令行，GitHub 支持网页上传：

1. 进入你的仓库 `gene-browser`

2. 点击 **Add file** → **Upload files**

3. 将 `index.html` 拖入上传区域

4. 在下方写提交信息，如 "add gene browser"

5. 点击 **Commit changes**

---

#### 4. 启用 GitHub Pages（托管静态页面）

1. 进入仓库页面，点击 **Settings** 选项卡

2. 左侧菜单点击 **Pages**

3. 在 **Branch** 区域：

   - 选择 `main` 分支

   - 文件夹选 `/ (root)`

   - 点击 **Save**

4. 等待 1-2 分钟，页面刷新后会显示：

   ```
   Your site is published at https://你的用户名.github.io/gene-browser/
   ```

5. 点击该链接，即可看到你的前端页面（但此时数据还未联通，因为 Worker 的 CORS 可能需要调整）。

---

#### 5. 更新 Worker 的 CORS 配置（允许前端域名访问）

虽然之前代码中设置了 `Access-Control-Allow-Origin: '*'`（允许所有来源），但生产环境建议指定你的 Pages 域名。

**修改 Worker 代码中的 CORS 头**：

在 `src/index.js` 中，将：

```javascript
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    ...
};
```

改为（更安全）：

```javascript
const ALLOWED_ORIGIN = 'https://你的用户名.github.io';
const corsHeaders = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};
```

**如果保持 `*` 不变也完全可用**，对于教学场景，`*` 更省事。

修改后，点击 **Save and Deploy** 重新部署 Worker。

---

#### 6. Git 常用命令速查表（学生必会）

| 命令 | 作用 | 示例 |
|------|------|------|
| `git init` | 初始化本地仓库 | `git init` |
| `git add 文件` | 将文件加入暂存区 | `git add index.html` |
| `git add .` | 添加所有变更 | `git add .` |
| `git commit -m "信息"` | 提交到本地仓库 | `git commit -m "更新页面"` |
| `git remote add origin URL` | 关联远程仓库 | `git remote add origin https://github.com/xxx/xxx.git` |
| `git push -u origin main` | 首次推送到远程 | `git push -u origin main` |
| `git push` | 后续推送 | `git push` |
| `git pull` | 拉取远程更新 | `git pull` |
| `git status` | 查看当前状态 | `git status` |
| `git log` | 查看提交历史 | `git log --oneline` |

**常见报错及解决**：

| 错误 | 原因 | 解决 |
|------|------|------|
| `fatal: not a git repository` | 未在项目目录执行 `git init` | 先执行 `git init` |
| `remote origin already exists` | 已关联过远程 | 用 `git remote set-url origin 新地址` 替换 |
| `! [rejected] main -> main (fetch first)` | 远程有新提交本地没有 | 先 `git pull` 再 `git push` |
| `Permission denied (publickey)` | SSH 密钥未配置 | 改用 HTTPS 地址，或用 `git config --global credential.helper store` 缓存密码 |

---

#### 7. 全链路测试（验证每个环节）

**步骤 1：测试 Worker API（独立测试）**

在浏览器地址栏直接输入：

```
https://gene-api.你的用户名.workers.dev/api/genes
```

应该返回一个 JSON 数组（即使为空也是 `[]`）。如果返回 `{"error":...}`，说明 Worker 有问题。

**步骤 2：测试前端页面（打开 GitHub Pages 地址）**

```
https://你的用户名.github.io/gene-browser/
```

页面应该正常加载，表格显示“暂无数据”或已有数据。

**步骤 3：添加一条数据测试**

- 在页面输入框中填写：ID = `TEST001`，序列 = `ATCG`，GC = `50`

- 点击“添加基因”

- 状态栏显示“✅ 基因 TEST001 添加成功”

- 点击“刷新列表”，表格应出现新行

**步骤 4：删除测试**

- 点击该行的“删除”按钮

- 确认后，刷新列表，该行消失

如果以上全部通过，说明整个链路（前端 → Worker → D1）完全打通。

---

#### 8. 常见部署错误及解决（完整排查表）

| 现象 | 可能原因 | 解决步骤 |
|------|----------|----------|
| Pages 页面 404 | 仓库名与地址不匹配，或未开启 Pages | 检查 Settings → Pages 是否显示 Published，确认分支为 main |
| 页面加载但表格报错 | 前端 JS 中 API_BASE 地址写错 | 打开 F12 → Console 查看错误，复制正确的 Worker URL |
| `Access-Control-Allow-Origin` 错误 | CORS 头未设置或设置不匹配 | Worker 代码中确保有 `Access-Control-Allow-Origin: *`，重新部署 |
| 添加数据失败 500 | D1 表不存在或字段不匹配 | 去 D1 控制台执行 `SELECT * FROM genes` 确认表结构 |
| 删除数据无反应 | DELETE 接口未实现或路径错误 | 检查 Worker 中的路由判断，确认 `startsWith('/api/genes/')` |
| GitHub Pages 更新不生效 | 浏览器缓存 | 按 Ctrl+F5（Windows）/ Cmd+Shift+R（Mac）强制刷新 |
| Worker 修改未生效 | 忘记点 Save and Deploy | 必须点击部署按钮，等待几秒 |

---

#### 9. 环境变量（在 Worker 中安全存储敏感信息）

如果不想在代码中硬编码数据库名称或密钥，可以使用 Worker 的环境变量。

**设置步骤**：

1. Worker 详情页 → Settings → Variables

2. 在 **Environment Variables** 区域添加键值对，例如：

   - 键：`DB_NAME`，值：`gene_db`

3. 在代码中通过 `env.DB_NAME` 访问

**适用场景**：存储 API 密钥、数据库 ID、环境标识（开发/生产）等。

---

#### 10. 部署后的项目文件结构（最终形态）

```
gene-browser/
├── index.html          # 主页面（包含 HTML + CSS + JS 全部）
└── (没有其他文件，全在 index.html 中)
```

对于本教程，单文件足够。后续复杂项目可拆分为：

```
gene-browser/
├── index.html
├── style.css
├── app.js
└── README.md
```

若拆分，需在 `index.html` 中引用：

```html
<link rel="stylesheet" href="style.css">
<script src="app.js"></script>
```

---

#### 11. 生产环境与开发环境的切换技巧

用一个变量控制 API 地址：

```javascript
const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = isDev 
    ? 'http://127.0.0.1:8787/api/genes'   // 本地开发（如果有）
    : 'https://gene-api.你的用户名.workers.dev/api/genes';
```

这样本地打开 `index.html` 和线上 Pages 使用不同的后端地址，方便调试。

---

#### 12. 检查清单（上线前逐一确认）

- [ ] D1 数据库中已创建 `genes` 表
- [ ] Worker 已绑定 D1 数据库（变量名 `DB`）
- [ ] Worker 代码已部署（含 CORS 头）
- [ ] 前端 `API_BASE` 指向正确的 Worker URL
- [ ] 前端代码已推送到 GitHub 仓库
- [ ] GitHub Pages 已启用并显示 Published
- [ ] 浏览器访问 Pages 地址，能正常加载页面
- [ ] 添加一条测试数据，刷新后能看到
- [ ] 删除测试数据，确认功能正常

---

#### 13. 本课核心命令速记

```bash
# Git 推送（每次更新代码后执行）
git add .
git commit -m "描述本次更新"
git push

# Worker 部署（在 Cloudflare 网页点击 Save and Deploy）
# 无需命令行

# D1 控制台查数据（验证用）
SELECT * FROM genes;
```

---

#### 14. 课后练习

1. 将第三课的完整前端代码部署到 GitHub Pages，生成并访问你的线上地址。

2. 在 Worker 中增加一个 `/api/genes/stats` 接口，返回基因总数、平均 GC、最长序列等统计信息，并在前端页面增加一个区域显示这些统计。

3. 修改前端页面，增加“按染色体筛选”的下拉菜单，从数据库中查询所有不同的染色体值（用 `SELECT DISTINCT chromosome FROM genes`），填充下拉选项。

4. 在 GitHub Pages 上部署一个简单的个人介绍页面（纯 HTML+CSS），熟悉 Push 流程。

5. （选做）将前端代码拆分为 `index.html`、`style.css`、`app.js` 三个文件，推送到 GitHub 并确认 Pages 正常加载。

### 第五课：网页设计实用操作 —— 从“能跑”到“好看好用”

本课目标：

- 理解视觉层次（字号、字重、间距、颜色对比）

- 掌握配色方案的基本法则（主色、辅色、中性色、强调色）

- 会使用 Google Fonts 和系统字体栈

- 掌握响应式设计（媒体查询、相对单位、移动优先）

- 学会使用 Bootstrap 5 快速搭建漂亮页面（栅格、导航栏、卡片、表格、按钮）

- 掌握 CSS 装饰技巧（圆角、阴影、渐变、过渡动画）

- 会用浏览器开发者工具（F12）调试和微调设计

- 将设计技巧直接应用到基因浏览器项目中

---

#### 1. 视觉层次（让用户知道先看什么）

通过控制四个属性建立层级：

| 属性 | 作用 | 取值示例 |
|------|------|----------|
| `font-size` | 越大越重要 | 标题 2rem，正文 1rem，辅助 0.8rem |
| `font-weight` | 越粗越突出 | 标题 700，正文 400，标签 600 |
| `color` 对比度 | 越暗/越亮越靠前 | 标题 #111，正文 #444，辅助 #888 |
| `margin` / `padding` | 越靠近白越多，元素越独立 | 标题下边距 20px |

**典型页面字号规范**：

```css
h1 { font-size: 2.5rem; font-weight: 700; color: #1a1a2e; }
h2 { font-size: 1.8rem; font-weight: 600; color: #16213e; }
h3 { font-size: 1.3rem; font-weight: 600; color: #0f3460; }
p  { font-size: 1rem; font-weight: 400; color: #333; line-height: 1.6; }
small { font-size: 0.85rem; color: #888; }
```

---

#### 2. 配色方案（三色法则）

一个页面不超过 3 种主色：

| 角色 | 占比 | 示例（科技蓝风格） |
|------|------|-------------------|
| 主色（Primary） | 60%（背景、大面积） | `#f8f9fa`（浅灰）或 `#ffffff` |
| 辅色（Secondary） | 30%（卡片、导航、按钮） | `#2c3e50`（深蓝灰） |
| 强调色（Accent） | 10%（按钮、链接、高亮） | `#3498db`（亮蓝）或 `#e74c3c`（红） |

**状态颜色（按钮/提示）**：

| 状态 | 颜色 | 十六进制 |
|------|------|----------|
| 成功 | 绿色 | `#27ae60` |
| 警告 | 橙色 | `#f39c12` |
| 危险 | 红色 | `#e74c3c` |
| 信息 | 蓝色 | `#3498db` |
| 中性 | 灰色 | `#95a5a6` |

**对比度检查**：文字和背景的对比度至少 4.5:1（WCAG AA 标准）。白底黑字最安全，灰底深灰字需谨慎。

---

#### 3. 字体（排版）

**推荐系统字体栈（跨平台一致）**：

```css
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
```

**使用 Google Fonts（如 Inter、Roboto、Noto Sans SC 支持中文）**：

在 `<head>` 中添加：

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,600;14..32,700&display=swap" rel="stylesheet">
```

然后在 CSS 中：

```css
body { font-family: 'Inter', -apple-system, sans-serif; }
```

**中文字体备选**：`"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif`

---

#### 4. 间距系统（Spacing）

使用 8px 或 4px 为基数的间距系统，保持统一：

| 层级 | 值 | 用途 |
|------|-----|------|
| xs | 4px | 文字与图标间距 |
| sm | 8px | 内边距（padding）小 |
| md | 16px | 标准内边距、元素间距 |
| lg | 24px | 章节间距、卡片内边距 |
| xl | 32px | 大区块间距 |
| 2xl | 48px | 页面边距、标题下方 |

**CSS 变量管理间距**：

```css
:root {
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-2xl: 48px;
}
.card { padding: var(--spacing-lg); }
.section { margin-bottom: var(--spacing-2xl); }
```

---

#### 5. 响应式设计（手机/平板/电脑都适配）

**媒体查询（Media Queries）**：

```css
/* 默认：手机优先（小屏） */
.container { padding: 16px; }
.card { width: 100%; }

/* 平板（≥ 768px） */
@media (min-width: 768px) {
    .container { padding: 24px; max-width: 720px; margin: auto; }
    .card { width: 48%; display: inline-block; }
}

/* 桌面（≥ 1024px） */
@media (min-width: 1024px) {
    .container { padding: 32px; max-width: 960px; }
    .card { width: 30%; }
}

/* 大屏（≥ 1280px） */
@media (min-width: 1280px) {
    .container { max-width: 1200px; }
}
```

**相对单位（代替 px）**：

| 单位 | 相对于 | 推荐场景 |
|------|--------|----------|
| `rem` | 根元素（html）字号（默认 16px） | 字号、间距（推荐） |
| `em` | 父元素字号 | 局部相对尺寸 |
| `%` | 父元素宽度 | 宽度比例 |
| `vw` / `vh` | 视口宽度/高度 | 全屏背景、大标题 |
| `clamp(min, preferred, max)` | 响应式区间 | `font-size: clamp(1rem, 2vw, 2rem);` |

**示例（响应式标题）**：

```css
h1 { font-size: clamp(1.8rem, 5vw, 3.5rem); }
```

---

#### 6. 装饰技巧（让页面精致）

| 效果 | CSS 属性 | 示例 |
|------|----------|------|
| 圆角 | `border-radius` | `border-radius: 12px;`（大圆角）、`50%`（圆形） |
| 阴影 | `box-shadow` | `box-shadow: 0 4px 12px rgba(0,0,0,0.08);` |
| 过渡动画 | `transition` | `transition: all 0.2s ease;` |
| 悬停上浮 | `transform` + `transition` | `transform: translateY(-4px);` |
| 渐变背景 | `background: linear-gradient(...)` | `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);` |

**按钮悬停效果示例**：

```css
.btn {
    background: #3498db;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}
.btn:hover {
    background: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(52, 152, 219, 0.4);
}
.btn:active {
    transform: translateY(0px);
    box-shadow: 0 1px 4px rgba(52, 152, 219, 0.3);
}
```

---

#### 7. 使用 Bootstrap 5 快速搭建（无需手写大量 CSS）

Bootstrap 是世界上最流行的 CSS 框架，通过 CDN 引入即可使用。

**引入方式（放在 `<head>` 中）**：

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
```

**Bootstrap 核心类速查表**：

| 类别 | 类名示例 | 作用 |
|------|----------|------|
| 容器 | `.container`, `.container-fluid` | 固定宽度 / 全宽容器 |
| 栅格 | `.row`, `.col-4`, `.col-md-6` | 12 列网格系统，响应式 |
| 按钮 | `.btn`, `.btn-primary`, `.btn-success`, `.btn-sm` | 预置颜色和尺寸 |
| 表格 | `.table`, `.table-striped`, `.table-hover` | 美化表格 |
| 卡片 | `.card`, `.card-body`, `.card-title` | 卡片组件 |
| 导航栏 | `.navbar`, `.navbar-expand-lg`, `.navbar-dark` | 顶栏导航 |
| 间距 | `.p-3`, `.m-2`, `.px-4`, `.mt-5` | p=padding, m=margin, t/r/b/l/x/y |
| 文字 | `.text-center`, `.text-primary`, `.fw-bold`, `.fs-3` | 对齐、颜色、字重、字号 |
| 显示 | `.d-flex`, `.d-none`, `.d-md-block` | flex 和显隐控制 |
| 背景 | `.bg-light`, `.bg-dark`, `.bg-primary` | 背景色 |

**Bootstrap 栅格示例（三列卡片）**：

```html
<div class="container">
    <div class="row g-4">  <!-- g-4 表示间距 -->
        <div class="col-md-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">基因 BRCA1</h5>
                    <p class="card-text">GC 含量: 50.2%</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">基因 TP53</h5>
                    <p class="card-text">GC 含量: 62.5%</p>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">基因 EGFR</h5>
                    <p class="card-text">GC 含量: 48.0%</p>
                </div>
            </div>
        </div>
    </div>
</div>
```

**用 Bootstrap 美化基因浏览器表格**：

```html
<table class="table table-striped table-hover">
    <thead class="table-dark">
        <tr><th>ID</th><th>序列</th><th>GC%</th><th>操作</th></tr>
    </thead>
    <tbody id="tableBody"></tbody>
</table>
```

JS 创建行时，删除按钮也可以用 Bootstrap 样式：

```javascript
btn.className = 'btn btn-danger btn-sm';
```

---

#### 8. 设计完整的页面布局（导航栏 + 主内容 + 页脚）

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>基因浏览器</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: #f4f6f9; }
        .hero { background: linear-gradient(135deg, #2c3e50, #3498db); color: white; padding: 60px 0; margin-bottom: 30px; }
        .hero h1 { font-size: clamp(2rem, 5vw, 3.5rem); }
    </style>
</head>
<body>
    <!-- 导航栏 -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="#">🧬 GeneDB</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link active" href="#">首页</a></li>
                    <li class="nav-item"><a class="nav-link" href="#">关于</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero 区域 -->
    <section class="hero text-center">
        <div class="container">
            <h1>基因数据浏览器</h1>
            <p class="lead">基于 Cloudflare D1 + Worker 的全栈应用</p>
        </div>
    </section>

    <!-- 主内容 -->
    <div class="container">
        <div class="row g-4">
            <div class="col-lg-3">
                <!-- 侧边筛选 -->
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">筛选</h5>
                        <select id="chromosomeFilter" class="form-select">
                            <option value="">全部染色体</option>
                            <option value="1">1</option>
                            <option value="17">17</option>
                        </select>
                        <button class="btn btn-primary mt-3 w-100" id="filterBtn">应用筛选</button>
                    </div>
                </div>
            </div>
            <div class="col-lg-9">
                <!-- 表格 -->
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="card-title mb-0">基因列表</h5>
                            <span class="badge bg-secondary" id="countBadge">0 条</span>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead class="table-dark">
                                    <tr><th>ID</th><th>序列</th><th>GC%</th><th>操作</th></tr>
                                </thead>
                                <tbody id="tableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 页脚 -->
    <footer class="text-center text-muted py-4 mt-5">
        <div class="container">
            <small>© 2026 GeneDB · 部署于 Cloudflare</small>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // 在这里放你的 API fetch 代码
        // 注意：API_BASE 替换为你的 Worker 地址
        const API_BASE = 'https://gene-api.你的用户名.workers.dev/api/genes';
        // ... 其余 JS 逻辑
    </script>
</body>
</html>
```

---

#### 9. 浏览器开发者工具（F12）的设计调试技巧

| 面板 | 用途 | 操作技巧 |
|------|------|----------|
| Elements | 查看和修改 DOM、样式 | 点击元素 → 右侧 Styles 可临时修改 CSS 值（实时预览）；勾选/取消样式行测试效果 |
| Computed | 查看最终计算样式 | 查看某个元素最终的 `font-size`、`color`、`margin` 等 |
| 选择元素图标（左上角箭头） | 点击页面元素直接定位 | 快速查看任意元素的盒模型和样式 |
| 强制状态 | 模拟 `:hover`, `:focus`, `:active` | 在 Styles 面板中点击 `:hov` 按钮 |
| 模拟设备 | 测试手机/平板响应式 | 点击 Toggle Device Toolbar（手机图标），选择 iPhone SE / iPad |
| Network | 查看加载速度和资源 | 勾选 "Disable cache" 强制刷新不缓存；查看图片和 CSS 加载时间 |

**盒模型可视化**：在 Elements 面板选中元素，底部或 Computed 中会显示 `margin`（橙）、`border`（黄）、`padding`（绿）、`content`（蓝）的图示。

---

#### 10. 常用设计资源网站（学生自取）

| 用途 | 网站 |
|------|------|
| 配色方案 | coolors.co / colorhunt.co |
| 图标库 | Font Awesome（fontawesome.com） / Bootstrap Icons |
| 字体 | Google Fonts（fonts.google.com） |
| 渐变背景 | uigradients.com |
| CSS 阴影生成 | cssmatic.com/box-shadow |
| 占位图片 | picsum.photos |

---

#### 11. 将设计应用到现有基因浏览器的改造步骤（实战）

1. 引入 Bootstrap CDN（HTML 头部）

2. 将表格套上 `.table .table-striped .table-hover`

3. 将输入框改为 `.form-control` 和 `.form-control-sm`

4. 将按钮改为 `.btn .btn-primary .btn-sm` 或 `.btn-success`

5. 用 `.container` 包裹主体内容

6. 用 `.card` 包裹表格和表单区域

7. 添加导航栏（`.navbar`）和页脚（简单居中文字）

8. 在状态栏使用 `.alert .alert-info` 或 `.badge`

9. 调整颜色：主色用 `#2c3e50` + `#3498db`，背景用 `#f8f9fa`

**改造后效果**：不增加一行自定义 CSS，页面整洁度提升 80%。

---

#### 12. 响应式检查清单

- [ ] 在手机（< 768px）上，表格能横向滚动（加 `.table-responsive`）
- [ ] 在平板上，卡片从 1 列变为 2 列（`.col-md-6`）
- [ ] 在桌面端，导航栏不折叠（`.navbar-expand-lg`）
- [ ] 字体大小随屏幕变化（用 `clamp` 或 Bootstrap 的 `.fs-*` 类）
- [ ] 按钮和输入框大小适中，容易点击（至少 44px 高度，触屏友好）

---

#### 13. 常见设计问题及解决

| 问题 | 原因 | 解决 |
|------|------|------|
| 页面太宽，左右无边距 | 缺少容器 | 用 `.container` 或 `.container-fluid` 包裹 |
| 表格在手机上看不全 | 表格过宽 | 用 `.table-responsive` 包裹 `<table>` |
| 颜色杂乱刺眼 | 颜色饱和度太高或太多 | 使用三色法则，主色用低饱和度，强调色用高饱和度点缀 |
| 文字看不清 | 对比度不足 | 检查灰色文字（#999）在浅灰背景上，改用 #333 或 #555 |
| 元素挤在一起 | 缺少间距 | 用 `.gap-*`、`.m-*`、`.p-*` 增加间距 |
| 按钮悬停没有反馈 | 缺少过渡 | 加 `transition: 0.2s;` 和 `:hover` 状态变化 |
| 页面加载慢 | 引入了过多 Google Fonts 或大图片 | 只引用需要的字重（400, 600, 700），图片压缩或使用 WebP 格式 |

---

#### 14. 本课核心记忆点

- **视觉层次**：大字重 → 大字号 → 高对比 → 多间距
- **配色**：60-30-10 法则，主色 + 辅色 + 强调色
- **响应式**：移动优先 + `@media (min-width: ...)` + 相对单位
- **Bootstrap**：CDN 引入，`.container` + `.row` + `.col-*` 栅格，`.table` + `.card` + `.btn` 快速美化
- **开发者工具**：F12 → Elements 改样式实时预览，Toggle Device 测试手机
- **装饰**：`border-radius`（圆角）+ `box-shadow`（阴影）+ `transition`（过渡）

---

#### 15. 课后练习

1. 将之前部署的基因浏览器页面用 Bootstrap 重新美化一遍，添加导航栏和页脚。

2. 设计一个包含 3 种颜色方案的页面（卡片、按钮、背景），使用 coolors.co 生成配色。

3. 用 Google Fonts 引入 `Inter` 或 `Noto Sans SC`，应用到页面的所有文字。

4. 在手机上打开你的 GitHub Pages 页面，检查布局是否错乱，用媒体查询修正至少一个问题。

5. 给表格的每一行添加悬停上浮效果（利用 `.table-hover` 或自定义 CSS `transform`）。

### 第六课：开源精神、GitHub 与 Cloudflare 的融合操作、Fork 与开源协议

本课目标：

- 理解开源精神（什么是开源，为什么它让技术发展这么快）

- 明确 GitHub 和 Cloudflare 各自的定位与关系（代码托管 vs 云端执行）

- 掌握 GitHub 上的 `fork` 操作（复制他人仓库到自己名下）

- 掌握 `fork` 后的同步操作（通过 `pull request` 或 `git remote add upstream`）

- 理解 3 种开源协议（MIT / Apache 2.0 / CC BY 系列）的区别

- 学会给自己的项目添加开源协议文件（LICENSE）

- 将前面搭建的基因浏览器项目变成真正的开源项目（添加 README、LICENSE、贡献指南）

---

#### 1. 开源精神是什么（一句话 + 一个例子）

- **开源**：源代码公开，允许任何人查看、使用、修改、分发。

- **核心理念**：通过协作避免重复造轮子。例如 Linux 内核、Python 解释器、Biopython、SQLite 都是开源项目，全世界的开发者共同维护。

- **对学生的意义**：你可以免费使用所有顶级工具，也可以把自己的项目放上去让别人使用和改进，这在找工作时是重要加分项。

---

#### 2. GitHub 和 Cloudflare 的关系（各司其职）

| 平台 | 核心功能 | 在教程中的角色 |
|------|----------|----------------|
| **GitHub** | 代码托管（Git 仓库）、版本控制、协作（Issue / PR）、静态网站托管（Pages） | 存放前端 HTML/CSS/JS，并通过 Pages 展示页面 |
| **Cloudflare** | 边缘计算（Worker）、云端数据库（D1）、CDN 加速、DNS 解析 | 提供后端 API（Worker）和数据库（D1），并加速全球访问 |

**融合操作（你已经做过）**：

- GitHub Pages 上的前端 JS 通过 `fetch` 请求 Cloudflare Worker 的 HTTPS 地址

- Cloudflare Worker 中的代码通过 `env.DB` 操作 D1 数据库

- 两者通过 HTTP 协议通信，不依赖本地环境

**为什么这两个要一起用（对比本地开发）**：

| 维度 | 传统本地开发 | GitHub + Cloudflare |
|------|-------------|----------------------|
| 代码存储 | 本地硬盘（易丢） | GitHub 仓库（永久备份） |
| 前端部署 | 自己买服务器或 FTP 上传 | GitHub Pages 免费托管，自动更新 |
| 后端 API | 自己写 Flask/Django 并部署到 VPS | Cloudflare Worker 无需服务器，按请求计费（免费额度足够） |
| 数据库 | 本地 MySQL / SQLite | D1 云端 SQLite，无需维护 |
| 协作 | 发邮件传文件 | GitHub PR / Fork / Issues 标准协作流程 |

---

#### 3. 为什么需要 GitHub（代码协作的核心）

- **版本控制**：每次修改都有记录，可以回退到任意历史版本

- **分支管理**：可以同时开发多个功能，互不干扰

- **Fork + Pull Request**：任何人都可以复制你的项目，修改后请求你合并

- **Issue**：用户报告 bug 或提需求

- **GitHub Pages**：免费静态托管（本节课重点之一）

---

#### 4. Fork 操作（复制他人仓库）

Fork 是在 GitHub 网页上完成的操作，不是 Git 命令。

**步骤**：

1. 打开一个开源项目页面（例如 `https://github.com/用户名/项目名`）

2. 点击右上角的 **Fork** 按钮

3. 选择 Fork 到自己的账号下（默认同名仓库）

4. 完成后，你的仓库列表中会出现这个副本，地址为 `https://github.com/你的用户名/项目名`

**Fork 后的典型工作流**：

```bash
# 1. 克隆自己 fork 的仓库到本地
git clone https://github.com/你的用户名/项目名.git

# 2. 添加原仓库为上游（upstream），以便同步更新
git remote add upstream https://github.com/原作者用户名/项目名.git

# 3. 做修改，提交到自己的仓库
git add .
git commit -m "修复了某个 bug"
git push origin main

# 4. 在 GitHub 网页上向原仓库发起 Pull Request（点击 Compare & pull request）
```

**Fork 后的同步操作（当原仓库更新了）**：

```bash
# 拉取上游仓库的更新
git fetch upstream

# 切换到自己的 main 分支
git checkout main

# 合并上游的 main 分支到本地
git merge upstream/main

# 推送到自己的 GitHub 远程仓库
git push origin main
```

---

#### 5. 开源协议（LICENSE）速查表

开源协议决定了别人能用你的代码做什么、是否要署名、是否要开源衍生作品。

| 协议 | 商用 | 修改 | 分发 | 要求署名 | 要求开源衍生代码（Copyleft） | 适用场景 |
|------|------|------|------|----------|------------------------------|----------|
| **MIT** | ✅ | ✅ | ✅ | ✅（必须保留版权声明） | ❌（可闭源） | 最宽松，几乎所有开发者工具都用（Node.js、React、Bootstrap） |
| **Apache 2.0** | ✅ | ✅ | ✅ | ✅（版权声明 + 免责声明） | ❌（可闭源） | 类似 MIT，但增加了专利授权保护，大公司偏爱（Google、Android） |
| **GPL 3.0** | ✅ | ✅ | ✅ | ✅ | ✅（衍生代码必须开源且使用 GPL） | 强制开源（Linux、WordPress），使用后你的项目也必须开源 |
| **BSD 3-Clause** | ✅ | ✅ | ✅ | ✅（禁止用作者名推广） | ❌ | 类似 MIT，多用于学术项目 |
| **CC BY 4.0** | ✅ | ✅ | ✅ | ✅（必须署名） | ❌ | 知识共享，适合文档、图片、数据，**不适用于软件代码** |
| **CC BY-SA 4.0** | ✅ | ✅ | ✅ | ✅ | ✅（衍生作品必须使用相同协议） | 类似 GPL，但面向非软件作品（百科、教材） |
| **CC BY-NC** | ❌（非商业） | ✅ | ✅ | ✅ | ❌ | 非商业用途，学术作业常用 |

**对学生的建议**：

- 代码项目：无脑选 **MIT**（最简单，最友好，雇主喜欢）

- 教程/文档（如这份教材）：选 **CC BY 4.0**（允许他人自由传播和修改，只要署名）

- 如果你想强制别人也开源：选 **GPL 3.0**

---

#### 6. 如何给项目添加 LICENSE（GitHub 网页操作）

1. 进入你的仓库主页

2. 点击 **Add file** → **Create new file**

3. 文件名输入 `LICENSE`（全大写）

4. GitHub 右侧会出现 **Choose a license template** 按钮

5. 点击它，选择 **MIT License**

6. 填写年份和你的全名

7. 点击 **Commit changes**

**手动添加（不改网页模板）**：

在项目根目录创建 `LICENSE` 文件，内容粘贴标准协议文本（可从 https://choosealicense.com 复制）。

---

#### 7. 给基因浏览器项目添加完整的开源 README（示例）

在仓库根目录创建 `README.md`（Markdown 格式），内容如下：

```markdown
# 🧬 Gene Browser

基于 **Cloudflare D1 + Worker + GitHub Pages** 的全栈基因数据浏览器。

## 功能

- 查看、添加、删除基因记录
- 实时 GC 含量统计
- 响应式设计，支持手机端

## 技术栈

- **前端**：HTML + CSS + JavaScript + Bootstrap 5
- **后端**：Cloudflare Workers（JavaScript）
- **数据库**：Cloudflare D1（SQLite）
- **部署**：GitHub Pages + Cloudflare Workers

## 快速开始

1. Fork 本仓库
2. 在 Cloudflare 创建 D1 数据库并绑定 Worker
3. 修改 `index.html` 中的 `API_BASE` 为你的 Worker 地址
4. 启用 GitHub Pages

## API 接口

- `GET /api/genes` — 获取所有基因
- `POST /api/genes` — 添加基因
- `DELETE /api/genes/:id` — 删除基因

## 开源协议

MIT License

## 作者

[你的名字] — [你的 GitHub 主页]
```

---

#### 8. GitHub 与 Cloudflare 的高级融合操作（边缘数据库 + 自动部署）

**融合操作 1：Worker 访问 GitHub 上的配置文件（通过 raw.githubusercontent.com）**

在 Worker 中可以用 `fetch` 读取 GitHub 仓库中的公开文件（如 JSON 配置）：

```javascript
const config = await fetch('https://raw.githubusercontent.com/你的用户名/gene-browser/main/config.json');
const data = await config.json();
```

**融合操作 2：用 GitHub Actions 自动部署 Worker**

GitHub Actions 可以在你 Push 代码后自动触发 Worker 部署（需要设置 Cloudflare API Token）。对于学生，手动部署更简单，本教程不展开，但知道有这个能力即可。

**融合操作 3：Cloudflare Pages 代替 GitHub Pages（更高级）**

Cloudflare Pages 可以直接连接 GitHub 仓库，每次 Push 自动构建和部署，并且支持 Worker 绑定（称为 Pages Functions），可以做到“前端 + 后端在同一个仓库”的更紧密集成。这是下一步学习的自然延伸。

---

#### 9. GitHub 上的协作流程（Issue + Pull Request）

**Issue（提问题或建议）**：

- 进入仓库 → Issues → New issue

- 标题简明，描述复现步骤或需求

- 可指定标签（bug / enhancement / question）

**Pull Request（PR，提交代码贡献）**：

1. Fork 目标仓库

2. 在 fork 中修改代码

3. 点击 **Contribute** → **Open pull request**

4. 填写说明，描述修改了什么

5. 等待作者 review 和 merge

---

#### 10. 开源协议选择决策树（给学生的简化版）

```
我的项目是什么类型？
├── 软件代码（JavaScript / Python / 库）
│   ├── 想让别人随便用，包括闭源商用 → MIT
│   ├── 想保护专利，大公司用 → Apache 2.0
│   └── 想强制衍生品也开源 → GPL 3.0
├── 文档 / 教程 / 图片（非代码）
│   ├── 允许任何人修改，要求署名 → CC BY 4.0
│   ├── 要求署名且衍生作品也必须 CC BY-SA → CC BY-SA 4.0
│   └── 只允许非商业用途 → CC BY-NC 4.0
└── 数据（CSV / JSON）
    └── 推荐 CC BY 4.0 或 CC0（放弃所有权）
```

---

#### 11. 开源“禁忌”（学生常犯）

| 错误 | 正确做法 |
|------|----------|
| 复制粘贴 GitHub 上的代码到自己的项目，但不写来源 | 必须保留原作者的 LICENSE 和版权声明 |
| 把别人的 GPL 代码放进自己的闭源项目 | 违反 GPL，GPL 代码必须使整个项目开源 |
| 使用 CC BY-NC 的图片用于商业产品 | 侵权，需获得授权 |
| 自己的项目不写 LICENSE | 默认“保留所有权利”，别人不能合法使用你的代码 |

---

#### 12. 本课核心命令 / 操作速查

| 操作 | 命令 / 步骤 |
|------|-------------|
| Fork 仓库 | GitHub 网页点击 Fork 按钮 |
| 克隆自己的 fork | `git clone https://github.com/你的用户名/仓库名.git` |
| 添加上游仓库 | `git remote add upstream https://github.com/原作者/仓库名.git` |
| 同步上游更新 | `git fetch upstream && git merge upstream/main` |
| 查看远程仓库 | `git remote -v` |
| 创建 LICENSE | GitHub 网页 Add file → LICENSE → Choose template |
| 创建 README | 写 `README.md`，用 Markdown 语法 |
| 发起 Pull Request | Fork 后，在 GitHub 网页点击 Contribute → Open pull request |

---

#### 13. 实战任务：将你的基因浏览器项目开源化

1. 在你的 `gene-browser` 仓库中添加 `LICENSE` 文件（选择 MIT）

2. 编写 `README.md`，包含项目描述、功能、技术栈、如何使用

3. 添加 `.gitignore` 文件，忽略不需要的临时文件（本教程因只有单文件，可省略）

4. 将仓库设置为 Public（如果是 Private，需要改为 Public）

5. 在 GitHub 上找到另一个同学的仓库，尝试 Fork 并查看其结构

6. （选做）尝试提交一个 Issue 到别人的仓库（提一个小建议）

---

#### 14. 常见问题解决（开源相关）

| 问题 | 解决 |
|------|------|
| 不确定选什么协议 | 用 MIT，最稳妥 |
| 用了别人 MIT 代码，需要做什么 | 在自己的项目中保留原作者的版权声明和 LICENSE 文件 |
| 想引用本教程的代码 | 本教程建议 CC BY 4.0，署名“教程作者 + 链接”即可 |
| Fork 后原仓库更新了，我的 fork 怎么同步 | 用 `git remote add upstream` + `git merge upstream/main` |
| 提交 PR 后没人合并 | 耐心等待，或在 Issue 中 @ 仓库维护者 |

---

#### 15. 本课小结

- **开源** = 代码公开 + 许可证明确，利己利他

- **GitHub** = 代码存储 + 协作平台；**Cloudflare** = 云执行 + 数据库

- **Fork** = 复制他人仓库到自己的账号，是贡献开源的第一步

- **Pull Request** = 请求别人合并你的修改

- **MIT** = 最宽松（推荐软件代码）；**CC BY** = 适合文档（署名即可）

- 一个完整的开源项目必须有 `LICENSE` 和 `README.md`

---

#### 16. 课后练习

1. 在 GitHub 上找一个你感兴趣的开源项目（例如 Biopython 或 Bootstrap），点击 Fork，观察复制后的仓库。

2. 为自己的基因浏览器项目添加 MIT LICENSE 和 README.md（用上面提供的模板）。

3. 用 `git remote add upstream` 将原仓库（如果你 fork 了别人的）添加为上游，并练习一次同步操作（只做 fetch，不 merge 也可）。

4. 查找 CC BY 4.0 和 CC BY-SA 4.0 的区别，用一句话写下来。

5. （选做）在班级内互相 Fork 同学的基因浏览器仓库，提一个 Issue 或提交一个 PR 修改 README 中的错别字。

## 附录 4

### 第一课：Linux 基本构成与终端使用 —— 以 Ubuntu 为例

本课目标：

- 理解 Linux 的组成（内核、Shell、文件系统、应用程序）

- 知道什么是终端（Terminal）和 Shell（Bash）

- 掌握打开终端的方法（Ubuntu 图形界面 / AidLux 桌面）

- 掌握文件系统结构（/ 根目录、/home、/etc、/var 等）

- 掌握文件和目录的绝对路径与相对路径

- 掌握最常用的 30+ 条终端命令（ls, cd, pwd, mkdir, rm, cp, mv, cat, less, grep, chmod, ps, top 等）

- 理解标准输入输出和重定向（>, >>, |）

- 掌握用户权限（读 r=4, 写 w=2, 执行 x=1）和 chmod 数字法

- 学会使用 man 命令查看帮助

---

#### 1. Linux 的四个组成部分（从底到顶）

| 层 | 名称 | 作用 | 举例 |
|----|------|------|------|
| 1 | 硬件 | CPU、内存、硬盘、网卡等物理设备 | Intel/ARM 芯片 |
| 2 | 内核（Kernel） | 管理硬件资源，提供系统调用 | Linux 内核（版本 5.x / 6.x） |
| 3 | Shell（壳） | 用户与内核交互的命令解释器 | Bash、Zsh、Fish |
| 4 | 应用程序 | 用户使用的各种软件 | ls, python, vim, chrome |

**本课重点**：Shell（终端命令）和文件系统（第 3 层与存储管理）。

---

#### 2. 终端（Terminal）与 Shell（Bash）

- **终端**：一个窗口，让你输入命令并看到输出（图形界面下的“终端模拟器”）

- **Shell**：终端里运行的程序（默认 Bash），负责解析你输入的命令并执行

**打开终端的方法**：

- Ubuntu 图形界面：按 `Ctrl + Alt + T`，或点击桌面左侧的终端图标

- AidLux（安卓平板）：打开 AidLux 应用，进入桌面，点击终端图标（或通过 SSH 连接）

- 如果只有命令行（无图形）：登录后自动进入终端

**终端提示符含义**：

```
user@hostname:~$ 
```

| 部分 | 含义 |
|------|------|
| `user` | 当前用户名 |
| `hostname` | 计算机名称 |
| `~` | 当前目录（家目录的简写） |
| `$` | 普通用户（`#` 表示 root 管理员） |

---

#### 3. 文件系统结构（一切皆文件）

Linux 的文件系统从根目录 `/` 开始，树形结构。

**常用目录速查表**：

| 目录 | 作用 |
|------|------|
| `/` | 根目录，所有目录的起点 |
| `/home` | 普通用户的家目录（如 `/home/yourname`） |
| `/root` | root 用户的家目录 |
| `/bin` | 基本命令（ls, cp 等） |
| `/sbin` | 系统管理命令（需 root） |
| `/etc` | 系统配置文件（如网络、软件源） |
| `/var` | 动态数据（日志、缓存） |
| `/tmp` | 临时文件（重启后可能清空） |
| `/usr` | 用户安装的程序和库 |
| `/opt` | 第三方软件（手动安装） |
| `/dev` | 设备文件（硬盘、USB） |
| `/proc` | 虚拟文件系统（内存中的进程信息） |

**路径写法**：

- 绝对路径：从 `/` 开始，如 `/home/user/file.txt`

- 相对路径：从当前目录开始，如 `./file.txt`（当前目录），`../file.txt`（上级目录），`~/file.txt`（家目录）

**特殊目录表示**：

| 符号 | 含义 |
|------|------|
| `.` | 当前目录 |
| `..` | 上级目录 |
| `~` | 当前用户的家目录 |
| `-` | 上一个工作目录（`cd -` 可回到） |

---

#### 4. 最基础命令（必会）

| 命令 | 作用 | 示例 |
|------|------|------|
| `pwd` | 显示当前工作目录的绝对路径 | `pwd` → `/home/user` |
| `ls` | 列出当前目录内容 | `ls -l`（详细信息），`ls -a`（包含隐藏文件） |
| `cd` | 切换目录 | `cd /etc`，`cd ..`，`cd ~` |
| `clear` | 清屏 | `clear`（或 `Ctrl+L`） |
| `whoami` | 显示当前用户名 | `whoami` → `user` |
| `uname -a` | 显示系统信息（内核版本等） | `uname -a` |
| `history` | 查看历史命令 | `history`，用 `!100` 执行第 100 条 |

**ls 常用选项**：

| 选项 | 含义 |
|------|------|
| `-l` | 长格式（权限、大小、时间） |
| `-a` | 显示所有文件（包括以 `.` 开头的隐藏文件） |
| `-h` | 人类可读大小（如 1K, 2M） |
| `-R` | 递归列出子目录 |
| `-S` | 按大小排序 |
| `-t` | 按修改时间排序 |

**示例组合**：`ls -lah`（常用）

---

#### 5. 文件和目录操作（增删改查）

**创建目录**：

```bash
mkdir 目录名                # 创建单个目录
mkdir -p 父目录/子目录      # 递归创建（父目录不存在时自动创建）
```

**创建空文件**：

```bash
touch 文件名                # 如果文件不存在则创建，存在则更新修改时间
```

**复制文件/目录**：

```bash
cp 源文件 目标文件          # 复制文件
cp -r 源目录 目标目录       # 递归复制目录（含子文件）
cp -i 源 目标              # 覆盖前提示确认
```

**移动/重命名**：

```bash
mv 源 目标                 # 移动文件或目录（重命名也用它）
```

**删除文件/目录**：

```bash
rm 文件名                  # 删除文件（不可恢复）
rm -r 目录名               # 递归删除目录
rm -f 文件名               # 强制删除，不提示
rmdir 空目录               # 删除空目录（很少用）
```

**查看文件内容**：

| 命令 | 作用 | 适用场景 |
|------|------|----------|
| `cat 文件` | 一次性显示全部内容 | 小文件 |
| `less 文件` | 分页浏览（按 q 退出，按 空格 下翻，按 b 上翻） | 大文件 |
| `head -n 10 文件` | 显示前 10 行 | 查看文件开头 |
| `tail -n 20 文件` | 显示后 20 行 | 查看日志最新部分 |
| `tail -f 文件` | 实时追加显示（动态跟踪日志） | 调试服务器 |

**示例**：

```bash
head -n 5 /var/log/syslog
tail -f /var/log/syslog   # 按 Ctrl+C 停止
```

---

#### 6. 通配符与模式匹配

| 通配符 | 含义 | 示例 |
|--------|------|------|
| `*` | 匹配任意字符（包括空） | `ls *.txt`（所有 txt 文件） |
| `?` | 匹配单个字符 | `ls file?.txt`（file1.txt, fileA.txt） |
| `[abc]` | 匹配 a 或 b 或 c | `ls file[1-3].txt`（file1, file2, file3） |
| `{a,b,c}` | 展开多个选项 | `mkdir {A,B,C}`（创建 3 个目录） |

---

#### 7. 文件权限与 chmod（重中之重）

**查看权限**：`ls -l` 输出的第一列，如 `-rwxr-xr--`

| 位置 | 含义 |
|------|------|
| 第 1 个字符 | `-`（普通文件），`d`（目录），`l`（链接） |
| 第 2-4 字符 | 所有者权限（u） |
| 第 5-7 字符 | 组权限（g） |
| 第 8-10 字符 | 其他用户权限（o） |

**权限字母含义**：

| 字母 | 数字 | 对文件 | 对目录 |
|------|------|--------|--------|
| `r` | 4 | 可读内容 | 可列出目录内容 |
| `w` | 2 | 可修改内容 | 可在目录内创建/删除文件 |
| `x` | 1 | 可执行（程序/脚本） | 可进入该目录（cd） |

**chmod 数字法**：三位数字分别对应 u, g, o，每位的数字 = r(4)+w(2)+x(1)

| 权限 | 数字 |
|------|------|
| `rwx` | 7 |
| `rw-` | 6 |
| `r-x` | 5 |
| `r--` | 4 |
| `--x` | 1 |
| `---` | 0 |

**示例**：

```bash
chmod 755 script.sh      # 所有者 rwx (7)，组 r-x (5)，其他 r-x (5)
chmod 600 secret.txt     # 所有者 rw- (6)，组 --- (0)，其他 --- (0)
chmod +x script.sh       # 给所有用户增加执行权限（字符法）
chmod u+x script.sh      # 仅所有者增加执行权限
```

**修改文件所有者**（需 root）：

```bash
chown 用户名:组名 文件
chown user:group file.txt
```

---

#### 8. 重定向与管道（连接命令的利器）

**标准输入/输出**：

- 标准输入（stdin）→ 0

- 标准输出（stdout）→ 1

- 标准错误（stderr）→ 2

**输出重定向**：

| 符号 | 作用 | 示例 |
|------|------|------|
| `>` | 覆盖写入文件 | `echo "hello" > file.txt` |
| `>>` | 追加到文件末尾 | `echo "world" >> file.txt` |
| `2>` | 重定向错误输出 | `cmd 2> error.log` |
| `&>` | 重定向所有输出（含错误） | `cmd &> output.log` |

**输入重定向**：

```bash
cat < file.txt          # 将 file.txt 作为输入传给 cat
```

**管道 `|`**：将前一个命令的输出作为后一个命令的输入

```bash
ls -l | grep ".txt"     # 列出所有包含 .txt 的行
ps aux | grep python    # 查找 python 进程
cat file.txt | wc -l    # 统计行数
```

**常用组合命令**：

```bash
# 查看大文件后 50 行并翻页
tail -n 50 log.txt | less

# 统计当前目录下所有 .c 文件的行数
find . -name "*.c" | xargs wc -l

# 查看占用端口 8080 的进程
netstat -tulpn | grep 8080   # 或 ss -tulpn | grep 8080
```

---

#### 9. 进程管理（ps, top, kill）

| 命令 | 作用 | 示例 |
|------|------|------|
| `ps aux` | 显示所有进程（详细） | `ps aux | grep python` |
| `ps -ef` | 另一种格式 | `ps -ef` |
| `top` | 实时进程监控（按 q 退出） | `top`（按 P 按 CPU 排序，按 M 按内存排序） |
| `htop` | 增强版 top（需安装） | `sudo apt install htop` |
| `kill PID` | 终止进程（发送 SIGTERM） | `kill 1234` |
| `kill -9 PID` | 强制终止（SIGKILL） | `kill -9 1234` |
| `bg` / `fg` | 后台/前台切换 | `Ctrl+Z` 暂停，`bg` 后台运行，`fg` 前台 |

**在命令末尾加 `&` 让进程后台运行**：

```bash
python long_task.py &
```

---

#### 10. 搜索文件与内容

| 命令 | 作用 | 示例 |
|------|------|------|
| `find 路径 -name 文件名` | 按文件名查找 | `find /home -name "*.txt"` |
| `find 路径 -type f -size +10M` | 查找大于 10M 的文件 | 同上 |
| `grep 模式 文件` | 在文件中搜索文本 | `grep "error" log.txt` |
| `grep -r 模式 目录` | 递归搜索目录内所有文件 | `grep -r "function" ./src` |
| `grep -i` | 忽略大小写 | `grep -i "dna"` |
| `grep -v` | 反向匹配（不包含） | `grep -v "debug"` |
| `grep -n` | 显示行号 | `grep -n "error" log.txt` |

**搜索命令的历史**：

```bash
history | grep "python"
```

---

#### 11. 压缩与解压（tar 和 zip）

**tar（最常用）**：

| 操作 | 命令 |
|------|------|
| 打包并压缩为 `.tar.gz` | `tar -czvf archive.tar.gz /path/to/folder` |
| 解压 `.tar.gz` | `tar -xzvf archive.tar.gz` |
| 打包为 `.tar`（不压缩） | `tar -cvf archive.tar /path` |
| 解压 `.tar` | `tar -xvf archive.tar` |
| 查看 `.tar.gz` 内容 | `tar -tzvf archive.tar.gz` |

**选项含义**：`c`=创建，`x`=解压，`z`=gzip 压缩，`v`=显示过程，`f`=指定文件名

**zip / unzip**：

```bash
zip -r archive.zip /path/to/folder
unzip archive.zip
```

---

#### 12. 网络相关命令

| 命令 | 作用 | 示例 |
|------|------|------|
| `ping 域名/IP` | 测试网络连通性 | `ping google.com`（按 Ctrl+C 停止） |
| `curl URL` | 发送 HTTP 请求（显示内容） | `curl https://api.example.com/data` |
| `wget URL` | 下载文件 | `wget https://example.com/file.zip` |
| `ifconfig` | 查看网络接口信息（需安装 net-tools） | `ifconfig` |
| `ip addr` | 现代替代（无需安装） | `ip addr` |
| `ss -tulpn` | 查看端口监听状态 | `ss -tulpn` |

---

#### 13. 帮助系统（man 和 --help）

- `命令 --help`：显示简短帮助（多数命令支持）

- `man 命令`：显示完整手册（按 q 退出，空格翻页）

```bash
ls --help
man ls
```

**在 man 中查找**：按 `/` 输入关键词，按 `n` 下一个，按 `N` 上一个。

---

#### 14. 用户切换与权限提升

| 命令 | 作用 | 示例 |
|------|------|------|
| `su 用户名` | 切换用户 | `su root`（需密码） |
| `sudo 命令` | 以 root 身份执行单条命令 | `sudo apt update` |
| `sudo -i` | 切换到 root 交互式 shell | `sudo -i`（慎用） |
| `exit` | 退出当前 shell 或用户 | `exit` |

**无需密码配置**：编辑 `/etc/sudoers`（用 `visudo`），一般不让学生做。

---

#### 15. 常用系统状态命令

| 命令 | 作用 |
|------|------|
| `df -h` | 查看磁盘分区使用情况（人类可读） |
| `du -sh 目录` | 查看目录总大小 |
| `du -h --max-depth=1` | 查看当前目录下各子目录大小 |
| `free -m` | 查看内存使用（以 MB 为单位） |
| `uptime` | 查看系统运行时间和负载 |
| `date` | 显示当前日期时间 |
| `who` | 查看当前登录用户 |
| `last` | 查看最近登录记录 |

---

#### 16. 环境变量与 PATH

查看所有环境变量：

```bash
env
```

查看某个变量：

```bash
echo $PATH
echo $HOME
```

临时设置变量：

```bash
export MY_VAR="hello"
echo $MY_VAR
```

永久设置（写进 `~/.bashrc` 或 `~/.profile`）：

```bash
echo 'export PATH=$PATH:/my/custom/bin' >> ~/.bashrc
source ~/.bashrc   # 立即生效
```

**PATH** 决定了当你输入一个命令时，系统会在哪些目录去查找可执行文件。

---

#### 17. 常见错误及解决（Linux 终端新手）

| 错误信息 | 原因 | 解决 |
|----------|------|------|
| `command not found` | 命令不存在或未安装 | 用 `which 命令` 查看路径，或用 `apt install` 安装 |
| `Permission denied` | 没有执行权限或文件只读 | 用 `chmod +x` 或 `sudo` |
| `No such file or directory` | 路径写错了 | 用 `ls` 检查路径是否存在，注意大小写 |
| `cannot create directory: File exists` | 目录已存在 | 用 `rm -r` 删除或换名字 |
| `Operation not permitted` | 需要 root 权限 | 加 `sudo` |
| 程序卡死（失去响应） | 进程占用大量资源 | 用 `top` 找到 PID，用 `kill -9` 终止 |
| 忘记 `sudo` 保存文件（vim 中） | 没有写权限 | 在 vim 中用 `:w !sudo tee %` 保存 |

---

#### 18. 本课核心命令速记表（30 条必会）

| 类别 | 命令 |
|------|------|
| 导航 | `pwd`, `ls`, `cd`, `clear` |
| 文件操作 | `touch`, `mkdir`, `cp`, `mv`, `rm`, `rmdir` |
| 查看内容 | `cat`, `less`, `head`, `tail` |
| 权限 | `chmod`, `chown` |
| 搜索 | `find`, `grep` |
| 进程 | `ps`, `top`, `kill` |
| 网络 | `ping`, `curl`, `wget`, `ifconfig` |
| 压缩 | `tar`, `zip`/`unzip` |
| 系统 | `df`, `du`, `free`, `uname` |
| 帮助 | `man`, `--help` |
| 重定向/管道 | `>`, `>>`, `|` |

---

#### 19. 本课小结

- Linux 核心构成：内核 + Shell + 文件系统 + 应用

- 终端是输入命令的地方，Bash 是最常见的 Shell

- 文件系统从 `/` 开始，绝对路径和相对路径要分清

- 权限用 3 位数字表示（r=4, w=2, x=1）

- 管道 `|` 和重定向 `>` 是组合命令的强大工具

- 遇到不懂的命令先看 `--help` 或 `man`

---

#### 20. 课后练习（全部在终端中完成）

1. 用 `pwd` 查看当前目录，用 `ls -la` 列出所有文件，识别隐藏文件。

2. 在家目录下创建 `linux_practice` 文件夹，进入该文件夹。

3. 用 `touch` 创建 `file1.txt`, `file2.log`, `script.sh`。

4. 用 `chmod 755 script.sh` 让 `script.sh` 可执行。

5. 用 `echo "Hello Linux" > file1.txt` 写入内容，用 `cat` 查看。

6. 用 `cp file1.txt file1_copy.txt` 复制文件。

7. 用 `mv file1_copy.txt backup.txt` 重命名。

8. 用 `mkdir -p dir1/dir2` 创建嵌套目录。

9. 用 `find . -name "*.txt"` 查找所有 txt 文件。

10. 用 `grep "Linux" file1.txt` 搜索关键词。

11. 用 `tail -f` 查看一个文件（先创建，然后开另一个终端追加内容）。

12. 用 `ps aux | grep bash` 查看当前 Shell 进程。

13. 用 `tar -czvf mydata.tar.gz dir1/` 压缩目录。

14. 用 `tar -xzvf mydata.tar.gz` 解压到当前目录（先移到别处测试）。

15. 用 `history | tail -10` 查看最近 10 条历史命令。

### 第二课：文本编辑、软件包管理、用户与组、环境配置、定时任务

本课目标：

- 掌握两种文本编辑器：nano（新手友好）和 vim（专业必备，三种模式）

- 会用 apt 包管理器安装、更新、卸载软件

- 理解用户和组的概念，会添加/删除用户和组

- 配置全局和用户级环境变量（/etc/profile, ~/.bashrc）

- 创建和管理别名（alias）简化常用命令

- 掌握 crontab 定时任务（分钟、小时、天、月、周）

---

#### 1. 文本编辑器 —— nano（最简单，适合新手）

nano 是 Ubuntu 默认安装的轻量编辑器，所有操作都有底部提示。

**打开/创建文件**：

```bash
nano 文件名
nano script.sh
```

**常用快捷键（底部 `^` 表示 Ctrl 键）**：

| 快捷键 | 作用 |
|--------|------|
| `Ctrl + O` | 保存文件（然后按 Enter 确认文件名） |
| `Ctrl + X` | 退出（如果有未保存修改会提示是否保存） |
| `Ctrl + K` | 剪切当前行 |
| `Ctrl + U` | 粘贴（取消剪切） |
| `Ctrl + W` | 查找文本 |
| `Ctrl + A` | 跳到行首 |
| `Ctrl + E` | 跳到行尾 |
| `Alt + A` | 设置标记（开始选择） |
| `Alt + 6` | 复制选中部分 |
| `Ctrl + G` | 显示帮助（所有快捷键列表） |

**适用场景**：快速修改配置文件、写短脚本。

---

#### 2. 文本编辑器 —— vim（功能强大，必须掌握基础）

vim 是 Linux 最强大的编辑器之一，但学习曲线较陡。只需要学会三种模式和基本操作即可。

**安装 vim**（若未安装）：

```bash
sudo apt install vim -y
```

**打开/创建文件**：

```bash
vim 文件名
```

**三种模式（核心概念）**：

| 模式 | 说明 | 进入方式 | 退出方式 |
|------|------|----------|----------|
| **普通模式（Normal）** | 默认，用于移动光标、删除、复制、粘贴 | 按 `Esc`（任何模式按 Esc 回到普通） | - |
| **插入模式（Insert）** | 输入文字（类似记事本） | 按 `i`（光标前插入）、`a`（光标后插入）、`o`（下一行插入） | 按 `Esc` 回到普通模式 |
| **命令行模式（Cmdline）** | 保存、退出、搜索、替换 | 在普通模式按 `:` | 按 `Enter` 执行，按 `Esc` 取消 |

**普通模式常用操作（光标移动）**：

| 按键 | 作用 |
|------|------|
| `h` | 左移一格 |
| `j` | 下移一行 |
| `k` | 上移一行 |
| `l` | 右移一格 |
| `0` | 跳到行首 |
| `$` | 跳到行尾 |
| `gg` | 跳到文件开头 |
| `G` | 跳到文件末尾 |
| `Ctrl + f` | 向下翻页 |
| `Ctrl + b` | 向上翻页 |

**普通模式常用操作（编辑）**：

| 按键 | 作用 |
|------|------|
| `x` | 删除光标所在字符 |
| `dd` | 删除当前行 |
| `yy` | 复制当前行 |
| `p` | 粘贴到光标下一行 |
| `u` | 撤销（undo） |
| `Ctrl + r` | 重做（redo） |
| `v` | 进入可视模式（选择文本），然后 `y` 复制，`d` 删除 |

**命令行模式（按 `:` 后输入）**：

| 命令 | 作用 |
|------|------|
| `:w` | 保存 |
| `:q` | 退出 |
| `:wq` | 保存并退出 |
| `:q!` | 强制退出（不保存） |
| `:w 新文件名` | 另存为 |
| `:/关键词` | 向下搜索关键词（按 `n` 下一个，`N` 上一个） |
| `:?关键词` | 向上搜索 |
| `:%s/旧/新/g` | 全文替换所有匹配 |
| `:set nu` | 显示行号 |
| `:set nonu` | 隐藏行号 |

**vim 速记口诀**：`i` 插入，`Esc` 退出，`:` 命令，`wq` 保存退出。

---

#### 3. 软件包管理 —— apt（Ubuntu 的核心包管理）

apt 是 Debian/Ubuntu 系列的包管理器，从软件源中安装、更新、卸载软件。

**更新软件源列表**（每次安装前建议执行）：

```bash
sudo apt update
```

**升级所有已安装的软件包**：

```bash
sudo apt upgrade -y          # -y 表示自动确认
sudo apt full-upgrade -y     # 更彻底升级（会处理依赖变更）
```

**搜索软件包**：

```bash
apt search 关键词
apt search python
```

**查看软件包信息**：

```bash
apt show 包名
```

**安装软件包**：

```bash
sudo apt install 包名 -y
sudo apt install python3-pip git vim -y
```

**卸载软件包**：

```bash
sudo apt remove 包名          # 卸载但保留配置文件
sudo apt purge 包名           # 完全卸载（删除配置文件）
sudo apt autoremove           # 清理不再需要的依赖包
```

**查看已安装的包**：

```bash
apt list --installed | grep 关键词
dpkg -l | grep 关键词
```

**apt 常用组合速查表**：

| 操作 | 命令 |
|------|------|
| 更新源列表 | `sudo apt update` |
| 升级所有包 | `sudo apt upgrade -y` |
| 安装软件 | `sudo apt install 包名` |
| 卸载 | `sudo apt remove 包名` |
| 搜索 | `apt search 关键词` |
| 查看信息 | `apt show 包名` |
| 清理依赖 | `sudo apt autoremove` |

---

#### 4. 用户和组管理

Linux 是多用户系统，每个用户有自己的家目录和权限。

**用户管理常用命令**：

| 命令 | 作用 | 示例 |
|------|------|------|
| `whoami` | 显示当前用户 | `whoami` |
| `id` | 显示用户 ID 和组 ID | `id` → uid=1000(user) gid=1000(user) |
| `useradd -m 用户名` | 创建新用户（同时创建家目录） | `sudo useradd -m john` |
| `passwd 用户名` | 设置/修改用户密码 | `sudo passwd john` |
| `usermod -aG 组 用户` | 将用户添加到组（追加） | `sudo usermod -aG sudo john` |
| `userdel -r 用户名` | 删除用户（连同家目录） | `sudo userdel -r john` |
| `su - 用户名` | 切换到该用户 | `su - john` |
| `exit` | 退出当前用户 | `exit` |

**组管理常用命令**：

| 命令 | 作用 | 示例 |
|------|------|------|
| `groupadd 组名` | 创建组 | `sudo groupadd bio` |
| `groupdel 组名` | 删除组 | `sudo groupdel bio` |
| `groups 用户名` | 查看用户所属组 | `groups john` |
| `gpasswd -d 用户 组` | 从组中移除用户 | `sudo gpasswd -d john bio` |

**常见系统组**：

| 组名 | 权限 |
|------|------|
| `sudo` | 可以使用 sudo 执行管理员命令 |
| `root` | 最高权限组（慎用） |
| `adm` | 可读取系统日志 |
| `www-data` | Web 服务器组 |
| `docker` | 允许运行 Docker 命令 |

**切换到 root（慎用）**：

```bash
sudo -i          # 进入 root 交互式 shell
# 提示符会从 $ 变成 #
exit             # 退出 root
```

---

#### 5. 环境配置 —— /etc/profile 与 ~/.bashrc

**两个重要文件**：

| 文件 | 作用范围 | 生效时机 |
|------|----------|----------|
| `/etc/profile` | 系统全局（所有用户） | 用户登录时 |
| `~/.bashrc` | 当前用户（每个用户独立） | 每次打开新终端（非登录 shell） |
| `~/.profile` | 当前用户 | 登录时（比 .bashrc 早） |

**修改 ~/.bashrc 添加自定义环境变量和别名**：

```bash
nano ~/.bashrc
```

在文件末尾添加：

```bash
# 自定义别名
alias ll='ls -la'
alias gs='git status'
alias gpl='git pull'
alias ..='cd ..'
alias ...='cd ../..'

# 环境变量
export MY_DATA="/home/user/data"
export PATH="$PATH:/home/user/my_scripts"

# 自定义提示符（可选）
export PS1="\u@\h \w \$ "   # user@hostname 当前路径
```

**使修改生效**（无需重新登录）：

```bash
source ~/.bashrc
# 或
. ~/.bashrc
```

**查看所有环境变量**：

```bash
env
echo $PATH
echo $MY_DATA
```

**添加自定义脚本目录到 PATH**：

```bash
mkdir -p ~/bin
# 将脚本放入 ~/bin，然后加到 PATH
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

之后放在 `~/bin` 下的可执行脚本可以直接输入文件名运行。

---

#### 6. 别名（alias）速查表

| 命令 | 作用 |
|------|------|
| `alias` | 查看当前所有别名 |
| `alias 名字='命令'` | 临时设置别名（仅当前终端） |
| `unalias 名字` | 删除别名 |

**常用实用别名（建议加进 ~/.bashrc）**：

```bash
alias ll='ls -alh'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias grep='grep --color=auto'
alias mkdir='mkdir -p'
alias rm='rm -i'          # 删除前确认
alias cp='cp -i'          # 覆盖前确认
alias mv='mv -i'
alias df='df -h'
alias du='du -h'
alias free='free -m'
alias psg='ps aux | grep'
```

---

#### 7. 定时任务 —— crontab

crontab 是 Linux 的定时任务调度器，可以按分钟、小时、天、周、月执行命令。

**编辑当前用户的定时任务**：

```bash
crontab -e
```

第一次运行会提示选择编辑器（选 nano 或 vim）。

**查看当前用户的定时任务**：

```bash
crontab -l
```

**删除所有定时任务**：

```bash
crontab -r
```

**crontab 时间格式（5 个字段）**：

```
分钟 小时 日 月 周 命令
 *    *   *  *  *  command
```

| 字段 | 取值范围 | 说明 |
|------|----------|------|
| 分钟 | 0-59 | - |
| 小时 | 0-23 | - |
| 日 | 1-31 | - |
| 月 | 1-12 | - |
| 周 | 0-7（0 和 7 都表示周日） | - |

**特殊符号**：

| 符号 | 含义 | 示例 |
|------|------|------|
| `*` | 任意值 | `* * * * *`（每分钟） |
| `,` | 列举多个值 | `1,15,30 * * * *`（每小时的第1、15、30分钟） |
| `-` | 范围 | `1-5 * * * *`（每小时的第1到5分钟） |
| `/n` | 每隔 n 单位 | `*/5 * * * *`（每5分钟） |
| `@reboot` | 系统启动时执行一次 | `@reboot /path/to/script` |

**常用 crontab 示例**：

| 需求 | 表达式 |
|------|--------|
| 每天凌晨 2:30 备份 | `30 2 * * * /home/user/backup.sh` |
| 每周一早上 8:00 清理日志 | `0 8 * * 1 /home/user/clean_logs.sh` |
| 每小时的第 15 分钟运行 | `15 * * * * /path/to/script` |
| 每 10 分钟运行一次 | `*/10 * * * * /path/to/script` |
| 每月 1 日凌晨 3:00 统计 | `0 3 1 * * /path/to/stats.sh` |
| 每天上午 9:00 到 17:00 每半小时运行 | `*/30 9-17 * * * /path/to/script` |

**crontab 日志查看**（确认任务是否执行）：

```bash
grep CRON /var/log/syslog | tail -20
# 或在 Ubuntu 20.04+ 用 journalctl
sudo journalctl -u cron | tail -20
```

**crontab 注意事项**：

- 命令必须使用**绝对路径**（如 `/usr/bin/python3` 而非 `python3`）
- 脚本要有执行权限（`chmod +x`）
- 可以在 crontab 中设置 PATH：`PATH=/usr/local/bin:/usr/bin:/bin`
- 输出会发送到邮箱（默认）/dev/null 丢弃：`* * * * * /path/script > /dev/null 2>&1`

---

#### 8. 实用组合：定时备份脚本 + crontab

创建备份脚本 `~/backup.sh`：

```bash
#!/bin/bash
# 备份家目录下的 Documents 文件夹
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /tmp/backup_$DATE.tar.gz /home/user/Documents
echo "备份完成: /tmp/backup_$DATE.tar.gz"
```

赋予执行权限：

```bash
chmod +x ~/backup.sh
```

添加到 crontab（每天凌晨 3:00 执行）：

```bash
crontab -e
# 添加一行
0 3 * * * /home/user/backup.sh > /dev/null 2>&1
```

---

#### 9. 常用系统服务管理（systemctl）

Ubuntu 使用 systemd 管理服务（后台守护进程）。

| 操作 | 命令 |
|------|------|
| 查看所有服务状态 | `systemctl status` |
| 查看特定服务状态 | `systemctl status ssh` |
| 启动服务 | `sudo systemctl start ssh` |
| 停止服务 | `sudo systemctl stop ssh` |
| 重启服务 | `sudo systemctl restart ssh` |
| 设置开机自启 | `sudo systemctl enable ssh` |
| 禁用开机自启 | `sudo systemctl disable ssh` |
| 查看所有已启用服务 | `systemctl list-unit-files --type=service --state=enabled` |

---

#### 10. 常见错误及解决

| 错误 | 原因 | 解决 |
|------|------|------|
| `sudo: command not found` | 在非 Debian 系统或未安装 sudo | 用 `su -` 切换到 root 执行 |
| `useradd: user 'xxx' already exists` | 用户已存在 | 用 `id xxx` 检查，或用 `userdel` 删除 |
| `Permission denied (publickey)` | SSH 密钥认证失败 | 检查 `~/.ssh/authorized_keys` 或使用密码登录 |
| `crontab: no crontab for user` | 用户没有 crontab | 用 `crontab -e` 创建 |
| `Command not found` 在 crontab 中 | 环境变量不同，PATH 不同 | 命令写绝对路径，或在 crontab 开头设置 `PATH=...` |
| `E212: Can't open file for writing` | vim 中文件只读或无权限 | 用 `:w !sudo tee %` 保存（需 sudo） |
| apt 安装时 `Unable to lock directory` | 有其他 apt 进程运行 | 等一会，或 `sudo rm /var/lib/dpkg/lock-frontend`（慎用） |

---

#### 11. 本课核心命令速记表

| 类别 | 命令 |
|------|------|
| 编辑（nano） | `nano 文件`, `Ctrl+O` 保存, `Ctrl+X` 退出 |
| 编辑（vim） | `vim 文件`, `i` 插入, `Esc`, `:wq` 保存退出 |
| 包管理 | `sudo apt update`, `sudo apt install 包`, `sudo apt remove 包` |
| 用户管理 | `sudo useradd -m 用户`, `sudo passwd 用户`, `sudo userdel -r 用户` |
| 组管理 | `sudo groupadd 组`, `usermod -aG 组 用户` |
| 环境配置 | `nano ~/.bashrc`, `source ~/.bashrc`, `export PATH=...` |
| 别名 | `alias 名字='命令'`, `unalias` |
| 定时任务 | `crontab -e`, `crontab -l`, `crontab -r` |
| 服务管理 | `systemctl status/start/stop/enable/disable` |

---

#### 12. 本课小结

- **nano**：新手首选，底部有快捷键提示

- **vim**：三种模式（普通/插入/命令行），掌握 `i` / `Esc` / `:wq` 即可起步

- **apt**：`update` 更新索引，`install` 安装，`remove` 卸载

- **用户和组**：`useradd -m`、`passwd`、`usermod -aG`、`userdel -r`

- **环境配置**：`~/.bashrc` 存放别名和 PATH，修改后 `source`

- **定时任务**：crontab 格式 `分 时 日 月 周 命令`，用绝对路径

---

#### 13. 课后练习

1. 用 nano 创建 `hello.txt`，输入 "Hello Linux"，保存退出，再用 cat 查看内容。

2. 用 vim 创建 `script.sh`，内容为 `#!/bin/bash` + `echo "Hello from vim"`，保存退出，用 `chmod +x` 使其可执行，运行它。

3. 用 `apt search htop` 搜索 htop，然后用 `sudo apt install htop -y` 安装，运行 `htop` 查看进程（按 q 退出）。

4. 创建一个新用户 `student`，设置密码，然后切换到该用户（`su - student`），查看当前路径。

5. 将 `student` 用户添加到 `sudo` 组，切换回去测试 `sudo apt update` 是否能执行。

6. 在 `~/.bashrc` 中添加别名 `ll='ls -alh'`，执行 `source ~/.bashrc`，输入 `ll` 验证。

7. 设置一个 crontab 任务，每分钟向 `/tmp/log.txt` 追加当前时间（用 `date` 命令），观察 3 分钟，然后用 `crontab -l` 查看任务，最后删除该任务。

8. 用 `tar` 将 `/home/student` 目录压缩为 `backup.tar.gz`，存放到 `/tmp`。


### 第三课：Shell 脚本编程、进程管理进阶、网络配置与 SSH 远程连接

本课目标：

- 编写 Shell 脚本（shebang、变量、特殊变量、算术运算）

- 掌握条件判断（test 命令、[ ]、if / elif / else、case）

- 掌握三种循环（for、while、until）

- 定义和调用 Shell 函数

- 理解进程后台运行（nohup、disown、&）

- 使用 screen 或 tmux 管理长期运行的任务

- 配置网络（查看 IP、测试连通性、下载文件）

- 使用 SSH 远程连接服务器，配置免密登录（ssh-keygen）

---

#### 1. Shell 脚本基础（第一行必须写 shebang）

**shebang（#!）** 指定脚本的解释器路径。

```bash
#!/bin/bash
# 这是注释，以 # 开头
echo "Hello World"
```

**创建并运行脚本的完整步骤**：

```bash
nano myscript.sh
# 写入上面的内容
chmod +x myscript.sh
./myscript.sh          # 或 bash myscript.sh
```

**脚本中的变量**：

| 变量类型 | 写法 | 示例 |
|----------|------|------|
| 用户自定义变量 | `变量名=值`（等号两边不能有空格） | `name="BRCA1"` |
| 引用变量 | `$变量名` 或 `${变量名}` | `echo $name` |
| 命令输出赋值 | `变量=$(命令)` 或 `变量=`命令`` | `date=$(date)` |
| 环境变量 | `export 变量名=值` | `export PATH=$PATH:/opt/bin` |

**特殊变量（脚本运行时自动获得）**：

| 变量 | 含义 | 示例 |
|------|------|------|
| `$0` | 脚本本身的名称 | `./myscript.sh` |
| `$1, $2, ...` | 第 1、2... 个参数 | `./myscript.sh arg1 arg2` 则 `$1=arg1` |
| `$#` | 参数个数 | `2` |
| `$@` | 所有参数（每个独立） | `"arg1" "arg2"` |
| `$*` | 所有参数（合并为一个字符串） | `"arg1 arg2"` |
| `$?` | 上一条命令的退出状态（0=成功，非0=失败） | `echo $?` |
| `$$` | 当前脚本的进程 ID（PID） | 打印 `1234` |

**算术运算（$(( ))）**：

```bash
a=10
b=20
sum=$((a + b))
echo $sum   # 30

# 其他运算符：+ - * / %（取余） **（幂）
echo $((5 * 6))   # 30
echo $((10 / 3))  # 3（整除）
echo $((10 % 3))  # 1
```

**字符串操作**：

| 操作 | 语法 | 示例 |
|------|------|------|
| 拼接 | 直接放在一起 | `str="Hello"` + `str2="$str World"` |
| 长度 | `${#变量}` | `echo ${#str}` → 5 |
| 切片 | `${变量:起始:长度}` | `echo ${str:1:3}` → `ell` |
| 替换 | `${变量/旧/新}`（首次）或 `${变量//旧/新}`（全部） | `echo ${str/H/h}` → `hello` |

---

#### 2. 条件判断（test 和 [ ]）

**test 命令**（等价于 `[ ]`）：

```bash
test 条件
# 或
[ 条件 ]   # 注意 [ 和 ] 两边必须有空格
```

**文件测试（常用）**：

| 条件 | 含义 | 示例 |
|------|------|------|
| `-e 文件` | 文件存在 | `[ -e /etc/passwd ]` |
| `-f 文件` | 是普通文件 | `[ -f myscript.sh ]` |
| `-d 目录` | 是目录 | `[ -d /home ]` |
| `-r 文件` | 可读 | `[ -r file.txt ]` |
| `-w 文件` | 可写 | `[ -w file.txt ]` |
| `-x 文件` | 可执行 | `[ -x script.sh ]` |
| `-s 文件` | 文件非空 | `[ -s log.txt ]` |

**数值比较**：

| 条件 | 含义 | 示例 |
|------|------|------|
| `$a -eq $b` | 等于 | `[ $a -eq 10 ]` |
| `$a -ne $b` | 不等于 | `[ $a -ne 5 ]` |
| `$a -gt $b` | 大于 | `[ $a -gt 3 ]` |
| `$a -ge $b` | 大于等于 | `[ $a -ge 4 ]` |
| `$a -lt $b` | 小于 | `[ $a -lt 8 ]` |
| `$a -le $b` | 小于等于 | `[ $a -le 6 ]` |

**字符串比较**：

| 条件 | 含义 | 示例 |
|------|------|------|
| `"$str1" = "$str2"` | 相等（等号两边有空格） | `[ "$name" = "BRCA1" ]` |
| `"$str1" != "$str2"` | 不等 | `[ "$name" != "TP53" ]` |
| `-z "$str"` | 字符串为空 | `[ -z "$var" ]` |
| `-n "$str"` | 字符串非空 | `[ -n "$var" ]` |

**逻辑组合**：

| 操作符 | 含义 | 示例 |
|--------|------|------|
| `!` | 非 | `[ ! -f file.txt ]` |
| `-a`（或用 `&&`） | 且（AND） | `[ $a -gt 5 -a $a -lt 10 ]` |
| `-o`（或用 `||`） | 或（OR） | `[ $a -eq 0 -o $a -eq 1 ]` |

在 `[ ]` 中用 `&&` 和 `||` 需用双括号 `[[ ]]`（bash 扩展）：

```bash
[[ $a -gt 5 && $a -lt 10 ]]
```

---

#### 3. if / elif / else 结构

```bash
if 条件; then
    命令块1
elif 条件2; then
    命令块2
else
    命令块3
fi
```

**示例**：

```bash
#!/bin/bash
read -p "输入 GC 含量: " gc
if [ -z "$gc" ]; then
    echo "您没有输入任何值"
elif [ $gc -ge 60 ]; then
    echo "高 GC 序列"
elif [ $gc -ge 40 ]; then
    echo "中等 GC 序列"
else
    echo "低 GC 序列"
fi
```

**简写形式（一行 if）**：

```bash
[ -f file.txt ] && echo "文件存在"     # 条件为真时执行
[ -f file.txt ] || echo "文件不存在"   # 条件为假时执行
```

---

#### 4. case 语句（多分支匹配）

```bash
case $变量 in
    模式1)
        命令块1
        ;;
    模式2)
        命令块2
        ;;
    *)
        默认命令块
        ;;
esac
```

**示例**：

```bash
#!/bin/bash
read -p "输入基因名: " gene
case $gene in
    BRCA1|BRCA2)
        echo "乳腺癌相关基因"
        ;;
    TP53)
        echo "肿瘤抑制基因"
        ;;
    *)
        echo "其他基因"
        ;;
esac
```

---

#### 5. 循环（for / while / until）

**for 循环（遍历列表）**：

```bash
# 遍历固定列表
for i in 1 2 3 4 5; do
    echo "数字: $i"
done

# 遍历序列（用 {起始..结束}）
for i in {1..10}; do
    echo $i
done

# 遍历文件
for file in *.txt; do
    echo "找到: $file"
done

# C 风格 for（步长）
for ((i=0; i<10; i+=2)); do
    echo $i   # 0 2 4 6 8
done
```

**while 循环（条件为真时执行）**：

```bash
count=0
while [ $count -lt 5 ]; do
    echo "计数: $count"
    count=$((count + 1))
done
```

**until 循环（条件为假时执行，直到为真）**：

```bash
count=0
until [ $count -ge 5 ]; do
    echo "计数: $count"
    count=$((count + 1))
done
```

**循环控制**：`break`（跳出循环），`continue`（跳过本次）。

---

#### 6. Shell 函数

**定义与调用**：

```bash
# 定义
函数名() {
    命令块
    return 返回值   # 可选，0-255
}

# 调用
函数名
函数名 参数1 参数2   # 在函数内用 $1, $2 接收
```

**示例**：

```bash
#!/bin/bash
calc_gc() {
    seq=$1
    g=$(echo $seq | grep -o 'G' | wc -l)
    c=$(echo $seq | grep -o 'C' | wc -l)
    gc=$(( (g + c) * 100 / ${#seq} ))
    echo $gc
}

# 调用
result=$(calc_gc "ATCGATCG")
echo "GC 含量: $result%"
```

**函数变量作用域**：默认全局。用 `local` 声明局部变量：

```bash
my_func() {
    local temp_var="只在函数内可见"
    echo $temp_var
}
```

---

#### 7. 进程后台运行（&、nohup、disown）

**& —— 后台运行**：

```bash
python long_task.py &
# 输出 [1] 1234（[job_id] PID）
```

后台进程会随终端关闭而终止。

**nohup —— 忽略挂断信号（终端关闭后继续运行）**：

```bash
nohup python long_task.py &
# 输出 nohup.out 保存所有输出
nohup python long_task.py > output.log 2>&1 &
```

`2>&1` 表示将错误输出合并到标准输出。

**disown —— 将后台进程从当前 Shell 的作业列表中移除（防止 Ctrl+D 退出时终止）**：

```bash
python long_task.py &
disown %1   # 或 disown PID
```

**jobs —— 查看当前 Shell 的后台作业**：

```bash
jobs -l
# 输出 [1] 1234 Running python long_task.py &
```

**fg / bg —— 前后台切换**：

```bash
fg %1      # 将作业 1 调回前台
bg %1      # 将暂停的作业 1 放到后台继续运行
```

**kill —— 终止进程**：

```bash
kill PID          # 正常终止（SIGTERM）
kill -9 PID       # 强制终止（SIGKILL）
kill -15 PID      # 同默认
kill -STOP PID    # 暂停进程
kill -CONT PID    # 恢复暂停的进程
```

---

#### 8. screen 和 tmux（终端复用器，SSH 断开后任务仍运行）

**screen（老牌，默认预装较少，需安装）**：

```bash
sudo apt install screen -y
```

| 操作 | 命令 |
|------|------|
| 创建新 screen 会话 | `screen -S 会话名` |
| 列出所有会话 | `screen -ls` |
| 脱离当前会话（保留后台） | `Ctrl + A, 然后按 D`（先按 Ctrl+A，松开再按 D） |
| 恢复会话 | `screen -r 会话名` |
| 杀死会话 | `screen -X -S 会话名 quit` |
| 在 screen 中滚屏 | `Ctrl + A, 然后按 Esc`（用上下方向键滚动，再按 Esc 退出） |

**tmux（更现代，功能更强大）**：

```bash
sudo apt install tmux -y
```

| 操作 | 命令 |
|------|------|
| 创建新会话 | `tmux new -s 会话名` |
| 列出会话 | `tmux ls` |
| 脱离会话 | `Ctrl + B, 然后按 D` |
| 恢复会话 | `tmux attach -t 会话名` |
| 水平分屏 | `Ctrl + B, 然后按 %` |
| 垂直分屏 | `Ctrl + B, 然后按 "` |
| 切换窗格 | `Ctrl + B, 然后按方向键` |
| 关闭当前窗格 | `Ctrl + B, 然后按 X`（或直接 `exit`） |
| 杀死会话 | `tmux kill-session -t 会话名` |
| 查看所有快捷键 | `Ctrl + B, 然后按 ?` |

**screen/tmux 的典型工作流**：

```bash
# 通过 SSH 连接到服务器
ssh user@server

# 启动 tmux
tmux new -s bio

# 运行长时间任务（如 BLAST 或 Python 脚本）
python large_analysis.py

# 按 Ctrl+B, D 脱离会话，关闭 SSH 连接

# 第二天重新 SSH 连接，恢复
tmux attach -t bio
# 任务仍在运行
```

---

#### 9. 网络配置与查看

**查看 IP 地址**：

| 命令 | 说明 |
|------|------|
| `ip addr` | 现代推荐，显示所有网络接口 |
| `ip a` | 简写 |
| `ifconfig` | 旧命令（需安装 net-tools） |
| `hostname -I` | 显示所有 IP 地址（仅数字） |

**启用/禁用网络接口**：

```bash
sudo ip link set eth0 up      # 启用
sudo ip link set eth0 down    # 禁用
```

**查看路由表**：

```bash
ip route
# 或 route -n
```

**测试网络连通性**：

```bash
ping -c 4 8.8.8.8           # 发送 4 个包
ping -c 4 google.com
```

**查看端口监听**：

```bash
ss -tulpn                   # 显示所有 TCP/UDP 端口
netstat -tulpn              # 传统命令
```

**下载文件**：

```bash
wget https://example.com/file.zip
wget -O newname.zip https://example.com/file.zip   # 指定保存名
curl -O https://example.com/file.zip               # -O 保存为原文件名
curl -L https://example.com/download               # -L 跟随重定向
```

**发送 HTTP 请求（测试 API）**：

```bash
curl https://api.example.com/data
curl -X POST -H "Content-Type: application/json" -d '{"id":"BRCA1"}' https://api.example.com/add
```

---

#### 10. SSH 远程连接（远程登录其他 Linux 机器）

**基本连接**：

```bash
ssh 用户名@IP地址
ssh user@192.168.1.100
ssh user@server.domain.com -p 2222   # 指定端口（默认 22）
```

**执行远程命令（不登录）**：

```bash
ssh user@server 'ls -la /home'
```

**安全拷贝（scp）**：

```bash
# 本地 → 远程
scp local_file.txt user@server:/home/user/
scp -r local_folder/ user@server:/home/user/   # 递归目录

# 远程 → 本地
scp user@server:/home/user/file.txt ./
```

**SSH 免密登录（ssh-keygen 生成密钥对）**：

```bash
# 1. 在客户端生成密钥对（一路回车，不设密码）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
# 生成 ~/.ssh/id_rsa（私钥）和 ~/.ssh/id_rsa.pub（公钥）

# 2. 将公钥复制到服务器
ssh-copy-id user@server
# 或手动复制（将 id_rsa.pub 内容追加到服务器 ~/.ssh/authorized_keys）

# 3. 之后 ssh 登录不再需要密码
ssh user@server
```

**SSH 配置文件（简化连接）**：创建 `~/.ssh/config`

```
Host myserver
    HostName 192.168.1.100
    User myname
    Port 22
    IdentityFile ~/.ssh/id_rsa
```

之后只需 `ssh myserver`。

---

#### 11. 防火墙基础（ufw）

Ubuntu 默认使用 ufw（Uncomplicated Firewall）：

```bash
sudo ufw status                  # 查看状态
sudo ufw enable                  # 启用防火墙
sudo ufw disable                 # 禁用
sudo ufw allow 22                # 允许 SSH 端口
sudo ufw allow 80/tcp            # 允许 HTTP
sudo ufw allow 443/tcp           # 允许 HTTPS
sudo ufw allow from 192.168.1.0/24 to any port 22   # 只允许特定网段 SSH
sudo ufw delete allow 80         # 删除规则
```

---

#### 12. 常见错误及解决

| 错误 | 原因 | 解决 |
|------|------|------|
| `./script.sh: Permission denied` | 脚本没有执行权限 | `chmod +x script.sh` |
| `syntax error near unexpected token` | if/for 等语句语法错误（漏了 `;` 或 `then`） | 检查 `if [条件]; then`，注意分号 |
| `command not found`（在 crontab 中） | 环境 PATH 不同 | 使用绝对路径，或在脚本开头 `source ~/.bashrc` |
| SSH 连接超时 | 服务器防火墙阻挡或 IP 不通 | 检查 `ufw` 状态，确认端口开放 |
| `Permission denied (publickey)` | 公钥未添加到服务器 | 运行 `ssh-copy-id` 或手动追加到 `~/.ssh/authorized_keys` |
| screen: command not found | screen 未安装 | `sudo apt install screen -y` |
| tmux: command not found | tmux 未安装 | `sudo apt install tmux -y` |
| `bash: syntax error: unexpected end of file` | if 或 case 没有对应的 `fi` / `esac` | 检查结尾标记 |
| 脚本中变量不生效 | 赋值时等号两边有空格 | 改为 `var=value`（无空格） |

---

#### 13. 本课核心命令速记表

| 类别 | 命令/语法 |
|------|-----------|
| 脚本开头 | `#!/bin/bash` |
| 变量赋值 | `var=value`，引用 `$var` |
| 算术运算 | `$((a + b))` |
| 条件测试 | `[ -f file ]`、`[ $a -eq $b ]`、`[ -z "$str" ]` |
| if 结构 | `if [条件]; then ...; elif ...; else ...; fi` |
| for 循环 | `for i in {1..10}; do ...; done` |
| while 循环 | `while [条件]; do ...; done` |
| 函数 | `func() { ...; }` |
| 后台运行 | `命令 &`，`nohup 命令 &` |
| screen | `screen -S name`、`Ctrl+A D`、`screen -r name` |
| tmux | `tmux new -s name`、`Ctrl+B D`、`tmux attach -t name` |
| SSH | `ssh user@host`、`scp`、`ssh-keygen`、`ssh-copy-id` |
| 防火墙 | `sudo ufw allow 端口`、`sudo ufw enable` |

---

#### 14. 本课小结

- Shell 脚本 = 将命令写进文件，加上 shebang 和权限即可运行

- 条件判断用 `[ ]`（注意空格），循环用 `for`/`while`，函数用 `函数名() { }`

- 后台运行：`&`（终端关闭会停），`nohup`（终端关闭不停），`screen`/`tmux`（可恢复会话）

- SSH 是远程管理的核心工具，`ssh-keygen` + `ssh-copy-id` 实现免密登录

- ufw 管理简单防火墙规则

---

#### 15. 课后练习

1. 写一个 Shell 脚本 `greet.sh`，接受一个名字作为参数（`$1`），输出 "Hello, 名字"。

2. 写一个脚本 `file_type.sh`，接受一个文件名作为参数，判断并输出：是普通文件、目录、还是不存在。

3. 写一个 `sum_n.sh` 脚本，用 `for` 循环计算 1 到 100 的和，输出结果。

4. 写一个函数 `reverse_seq`，接受 DNA 序列字符串作为参数，用 `rev` 命令（或手动循环）输出反向序列。

5. 使用 `nohup` 运行一个睡眠命令 `sleep 300 &`，然后关闭终端再重新打开，用 `ps aux | grep sleep` 确认它还在运行。

6. 安装 tmux，创建一个名为 `test` 的会话，在其中运行 `top`，然后脱离，重新连接确认会话恢复。

7. 生成 SSH 密钥对（`ssh-keygen`），然后将公钥添加到本机的 `~/.ssh/authorized_keys`（模拟免密登录本机），测试 `ssh localhost` 是否免密。

8. 用 `scp` 将本机的一个文件复制到远程服务器（如果有条件），或从远程下载一个文件到本地。

### 第四课：AidLux —— 在安卓平板/手机上运行原生 Ubuntu

本课目标：

- 理解 AidLux 是什么（Android + Linux 融合系统）

- 在安卓平板/手机上安装 AidLux

- 完成首次启动配置

- 进入 AidLux 的 Linux 终端

- 使用 apt 安装软件（与 Ubuntu 完全一致）

- 通过浏览器或 SSH 远程访问 AidLux

- 掌握 AidLux 的默认账号密码、sudo 密码

---

#### 1. AidLux 是什么

AidLux 是成都阿加犀智能科技开发的端侧 AI 开发平台[reference:0][reference:1]。它通过共享 Android 底层的 Linux 内核，在安卓设备上构建了一个**完整的原生 Linux 环境**（默认是 Ubuntu），与 Android 系统同时运行，**无需虚拟机，无需重启即可切换**[reference:2][reference:3][reference:4]。

**一句话理解**：在平板上安装 AidLux App，打开后你就拥有了一台带图形界面的 Ubuntu 电脑。

**核心特点**：

| 特点 | 说明 |
|------|------|
| 原生 Linux 内核 | 基于 Android 底层 Linux kernel 构建，非虚拟机[reference:6] |
| 图形化桌面 | 提供 Ubuntu 桌面环境（可通过触摸屏或浏览器访问）[reference:7] |
| 完整命令行 | 支持 `apt`、`vim`、`ssh`、`git` 等所有 Ubuntu 命令[reference:8] |
| AI 工具预装 | 预装 Python、OpenCV、PyTorch、TensorFlow 等[reference:9] |
| 支持开发工具 | VSCode、Jupyter Notebook、PyCharm 等[reference:10] |

---

#### 2. 安装 AidLux

**系统要求**：

| 要求 | 最低配置 |
|------|----------|
| Android 版本 | ≥ 6.0.1[reference:11] |
| CPU 架构 | arm64-v8a[reference:12][reference:13] |
| 剩余存储空间 | > 3GB[reference:14] |

**安装方式（三选一）**：

| 方式 | 操作 |
|------|------|
| 应用商店 | 华为、联想、小米等应用商店搜索 "AidLux" 下载[reference:15][reference:16] |
| 官网 APK | 从 AidLux 开发者社区下载 APK 安装[reference:17][reference:18] |
| 开发板预装 | 部分开发板出厂已预装，无需安装[reference:19] |

**安装步骤**：

```bash
# 1. 在应用商店搜索 "AidLux"，点击下载安装
# 2. 若从官网下载 APK，在安卓设置中允许"未知来源应用"安装
# 3. 安装完成后，桌面出现 AidLux 图标
```

> **注意**：若安装时提示 `Permission denied`，先卸载旧版本，重启手机后再安装[reference:20]。

---

#### 3. 首次启动与初始化

1. 点击 AidLux 图标打开 App

2. 可以不登录，同意协议后跳过[reference:21]

3. App 会自动下载并解压 Linux 环境（约需几分钟，进度条到 100% 即完成）[reference:22]

4. 初始化完成后，进入 AidLux 主界面

**界面布局**：

- 顶部：桌面环境（类似 Ubuntu 图形界面）

- 底部：功能图标（终端、文件管理器、应用中心、设置等）

---

#### 4. 进入 Linux 终端（核心操作）

AidLux 提供三种方式进入 Linux 终端：

**方式一：App 内直接打开（最常用）**

在 AidLux 主界面，点击底部第一个图标 **"终端"**，即可进入命令行[reference:23]。

**方式二：浏览器远程访问（Web 桌面）**

在平板或电脑的浏览器中输入：

```
http://平板的IP地址:8000
```

例如 `http://192.168.1.100:8000`[reference:24]。登录后点击桌面上的"终端"图标[reference:25]。

**方式三：SSH 远程连接（从电脑连接平板）**

确保平板和电脑在同一 Wi-Fi 下，在电脑终端执行：

```bash
ssh aidlux@平板的IP地址 -p 2222
```

例如：

```bash
ssh aidlux@192.168.1.100 -p 2222
```

默认密码：`aidlux`[reference:26][reference:27]。

---

#### 5. 默认账号密码（必须记住）

| 项目 | 账号/密码 |
|------|-----------|
| 登录用户名 | `aidlux` |
| 登录密码 | `aidlux`[reference:28] |
| `sudo` 密码 | `aidlux`[reference:29] |
| `su` 密码 | `P@ssw0rd4aidlux`[reference:30] |

> **重要**：在终端输入密码时屏幕不会显示任何字符（包括 `*`），这是 Linux 的正常安全机制，**直接输入密码后按回车即可**[reference:31]。

---

#### 6. 终端操作体验（与 Ubuntu 完全一致）

进入终端后，所有 Ubuntu 命令都可以使用：

```bash
# 查看当前用户
whoami
# 输出: aidlux

# 查看系统信息
uname -a

# 查看 Ubuntu 版本
lsb_release -a

# 更新软件源
sudo apt update

# 安装软件（与 Ubuntu 完全相同）
sudo apt install vim git python3-pip -y

# 查看 IP 地址（用于远程访问）
ip addr
```

**AidLux 终端的特殊优化**：

- **Touch Bar**：底部提供 `Ctrl`、`Alt`、`Tab` 等虚拟按键，方便触屏操作

- **多标签页**：支持同时开启多个终端标签页

- **外接键盘**：连接蓝牙或 USB 键盘后自动适配[reference:34]

---

#### 7. 文件系统与路径

AidLux 的 Linux 文件系统与 Ubuntu 一致，根目录是 `/`。

**重要路径**：

| 路径 | 说明 |
|------|------|
| `/home/aidlux` | 用户家目录（`~`） |
| `/sdcard` | 安卓系统的内部存储（可访问平板文件） |
| `/mnt` | 挂载点 |

> **注意**：`/home/AidLux` 是 Web 远程桌面唯一有权限接收文件上传的目录[reference:35]。

---

#### 8. 图形化桌面环境

AidLux 2.1.0 版本默认桌面环境从 Xfce 升级为 **Ubuntu-desktop**，提供更现代的 Linux 桌面体验[reference:37]。

**桌面功能**：

- 可通过触摸屏直接操作

- 支持鼠标和键盘（USB 或蓝牙）

- 可通过浏览器远程访问（`http://IP:8000`）

- 内置应用中心，可安装常用软件

---

#### 9. 网络与远程访问

**查看平板 IP 地址**：

```bash
ip addr
# 或
ifconfig
```

**从电脑浏览器访问 AidLux 桌面**：

```
http://平板IP:8000
```

默认用户名/密码：`aidlux`/`aidlux`[reference:39]。

**从电脑 SSH 连接**：

```bash
ssh aidlux@平板IP -p 2222
```

密码：`aidlux`[reference:40]。

**通过 ADB 连接（Windows）**：

```bash
adb root
adb shell
docker exec -it aidlux bash
```

然后即可进入 AidLux 的 Linux 终端[reference:41]。

---

#### 10. 常见问题与解决

| 问题 | 原因 | 解决 |
|------|------|------|
| 安装时提示 `Permission denied` | 旧版本残留 | 卸载旧版，重启后重装[reference:42] |
| 终端输入密码没反应 | Linux 正常安全机制 | 直接输入密码后回车[reference:43] |
| `sudo` 密码错误 | 默认密码是 `aidlux` | 确认输入的是 `aidlux`[reference:44] |
| Web 远程 8000 端口能访问但终端打不开 | nginx 服务异常 | 在终端执行 `sudo nginx`[reference:45] |
| 无法访问 `/sdcard` | 权限问题 | 在安卓设置中授予 AidLux 存储权限[reference:46] |
| 系统卡顿 | 资源占用高 | 关闭不必要的 Android 后台应用 |
| 初始化进度卡住 | 网络问题或存储不足 | 检查 Wi-Fi 连接，确保有 >3GB 剩余空间[reference:47] |

---

#### 11. AidLux vs 原生 Ubuntu（对比）

| 维度 | AidLux | 原生 Ubuntu（x86 PC） |
|------|--------|----------------------|
| 硬件 | 安卓手机/平板（ARM 架构） | x86 电脑 |
| 安装方式 | 安装 APK | 制作启动盘安装 |
| 图形界面 | 支持（Ubuntu-desktop） | 支持 |
| 终端命令 | 完全一致 | 完全一致 |
| `apt` 包管理 | ✅ | ✅ |
| Python / pip | ✅ | ✅ |
| 预装 AI 工具 | ✅（PyTorch、TensorFlow、OpenCV） | 需手动安装 |
| 性能 | 受限于移动芯片 | 受限于 PC 硬件 |

**结论**：AidLux 的终端体验与原生 Ubuntu **几乎完全一致**，附录 4 前三课的所有命令（`ls`、`cd`、`mkdir`、`apt`、`vim`、`chmod`、`crontab`、`ssh` 等）在 AidLux 中**全部通用**。

---

#### 12. 本课核心操作速查

| 操作 | 命令/步骤 |
|------|-----------|
| 安装 AidLux | 应用商店搜索 "AidLux" 下载安装 |
| 打开终端 | 点击 AidLux 桌面底部"终端"图标 |
| 更新软件源 | `sudo apt update` |
| 安装软件 | `sudo apt install 包名 -y` |
| 查看 IP | `ip addr` |
| 浏览器远程访问 | `http://平板IP:8000` |
| SSH 远程连接 | `ssh aidlux@平板IP -p 2222` |
| 默认密码 | `aidlux`（登录 + sudo） |
| su 密码 | `P@ssw0rd4aidlux` |

---

#### 13. 本课小结

- AidLux = 安卓 App + 原生 Ubuntu 环境，**非虚拟机，无性能损耗**

- 终端命令与 Ubuntu **完全一致**，前三课所有内容通用

- 三种进入终端的方式：App 内直接打开、浏览器 Web 桌面、SSH 远程

- 默认账号密码：`aidlux`/`aidlux`，sudo 密码也是 `aidlux`

- 支持 `apt` 安装任意 Linux 软件，与 PC 上的 Ubuntu 体验相同

---

#### 14. 课后练习

1. 在你的安卓平板或手机上安装 AidLux（应用商店搜索下载）。

2. 打开 AidLux，完成首次初始化（等待进度条到 100%）。

3. 点击底部"终端"图标，进入命令行，执行 `whoami` 和 `pwd` 查看当前用户和目录。

4. 执行 `sudo apt update && sudo apt install vim -y` 安装 vim。

5. 用 `ip addr` 查看平板的 IP 地址。

6. 在电脑浏览器中输入 `http://平板IP:8000`，用 `aidlux`/`aidlux` 登录 Web 桌面。

7. 在 Web 桌面中打开终端，执行 `lsb_release -a` 查看 Ubuntu 版本。

8. （选做）在电脑上用 SSH 连接平板：`ssh aidlux@平板IP -p 2222`。

## 附录5

### 第一课：人工智能原理 —— 从概率到智能

本课目标：

- 理解人工智能、机器学习、深度学习三者的层级关系

- 掌握大语言模型的核心数学原理（概率、条件概率、贝叶斯）

- 理解神经网络的基本结构（神经元、层、激活函数、反向传播）

- 掌握大语言模型的训练流程（预训练、SFT、RLHF）

- 理解 Transformer 的核心机制（注意力、位置编码）

- 理解 Token、上下文窗口、参数量的概念

- 掌握模型推理的基本过程（自回归生成）

---

#### 1. AI / ML / DL / LLM 层级关系

| 层级 | 全称 | 说明 | 举例 |
|------|------|------|------|
| AI | 人工智能 | 让机器模拟人类智能的总称 | 所有智能系统 |
| ML | 机器学习 | AI 的子集，从数据中学习规律 | 线性回归、决策树 |
| DL | 深度学习 | ML 的子集，使用多层神经网络 | CNN、RNN、Transformer |
| LLM | 大语言模型 | DL 在文本领域的特化应用 | ChatGPT、Qwen、DeepSeek |

**一句话理解**：LLM ⊂ DL ⊂ ML ⊂ AI。

---

#### 2. 概率 —— 智能的数学基础

智能的本质是**在不确定性下做决策**。概率就是描述不确定性的数学工具。

**基本概率**：

| 概念 | 公式 | 含义 |
|------|------|------|
| 概率 | P(A) = 事件A发生次数 / 总次数 | 某事件发生的可能性 |
| 联合概率 | P(A,B) | A 和 B 同时发生 |
| 条件概率 | P(A\|B) = P(A,B) / P(B) | 在 B 发生的条件下 A 发生的概率 |

**示例**：在 DNA 序列中，P(A) = A 碱基出现的频率。P(G,C) 是 G 和 C 同时出现的概率。P(C\|G) 是在 G 后面出现 C 的概率。

**大语言模型本质上是一个概率模型**：给定前文（上下文），预测下一个词（Token）的概率分布。

```
P(下一个词 | 前文) = ?
```

模型会为词汇表中每个词计算一个概率，然后选择概率最高的词（或按概率采样）。

---

#### 3. 条件概率与贝叶斯定理（LLM 的核心）

**贝叶斯定理**：

```
P(A|B) = P(B|A) × P(A) / P(B)
```

**在 LLM 中的对应**：

- P(下一个词 | 前文) —— 模型要计算的条件概率

- 这本质上是贝叶斯推断：根据已有信息（前文）推断最可能的下一个词

**链式法则（语言模型的基础）**：

```
P(w1, w2, ..., wn) = P(w1) × P(w2|w1) × P(w3|w1,w2) × ... × P(wn|w1,...,w_{n-1})
```

LLM 就是通过大量文本学习这些条件概率的模型。

---

#### 4. 神经网络基础 —— 神经元

**单个神经元**：

```
输入 x1, x2, ..., xn
权重 w1, w2, ..., wn
偏置 b
输出 = 激活函数( Σ(wi × xi) + b )
```

**激活函数（引入非线性）**：

| 函数 | 公式 | 用途 |
|------|------|------|
| ReLU | max(0, x) | 隐藏层（最常用） |
| Sigmoid | 1/(1+e^(-x)) | 二分类输出层 |
| Softmax | e^xi / Σe^xj | 多分类输出层（LLM 输出层用这个） |

**神经网络 = 多层神经元堆叠**：

```
输入层 → 隐藏层1 → 隐藏层2 → ... → 输出层
```

每层将上一层的输出通过权重矩阵变换后传入下一层。

---

#### 5. 训练 —— 模型如何学习

**三步走**：

| 阶段 | 名称 | 说明 |
|------|------|------|
| 1 | 前向传播 | 输入数据 → 网络 → 输出预测 |
| 2 | 计算损失 | 比较预测与真实值，计算误差 |
| 3 | 反向传播 | 将误差从输出层反向传回，更新权重 |

**损失函数（衡量预测有多差）**：

- 交叉熵损失（LLM 常用）：`Loss = -Σ y_true × log(y_pred)`

**优化算法**：梯度下降（SGD、Adam 等），沿着损失函数下降的方向更新权重。

---

#### 6. Transformer —— 现代 LLM 的基石

Transformer 是 2017 年提出的架构，所有主流 LLM 都基于它。

**核心机制：自注意力（Self-Attention）**

让模型在处理一个词时，能"关注"到句子中其他词的重要性。

```
Attention(Q, K, V) = softmax(Q × K^T / √d) × V
```

| 符号 | 含义 |
|------|------|
| Q（Query） | 当前词的"查询"向量 |
| K（Key） | 所有词的"键"向量 |
| V（Value） | 所有词的"值"向量 |
| d | 向量维度（缩放因子） |

**多头注意力**：同时运行多个注意力头，每个头关注不同的关系模式。

**位置编码**：因为 Attention 本身不区分词序，需要额外加入位置信息。

**Transformer 结构**：

```
输入 → 位置编码 → 多头注意力 → 残差连接 + 归一化 → 前馈网络 → 残差连接 + 归一化 → ...（重复 N 层）→ 输出
```

---

#### 7. 大语言模型的训练流程（三阶段）

| 阶段 | 名称 | 数据 | 目的 |
|------|------|------|------|
| 1 | 预训练（Pre-training） | 海量互联网文本（TB 级） | 学习语言的基本规律和世界知识 |
| 2 | 监督微调（SFT） | 人工标注的问答对 | 让模型学会"对话"和"指令跟随" |
| 3 | 人类反馈强化学习（RLHF） | 人类偏好排序数据 | 让模型的回答更符合人类期望 |

---

#### 8. Token、上下文、参数量（关键概念）

**Token（词元）**：

- 模型处理的基本单位，不一定是完整单词

- 例如 "Artificial Intelligence" 可能被切分为 `["Art", "ificial", " Intelligence"]`

- 计费按 Token 数量计算

**上下文窗口（Context Window）**：

- 模型一次能"记住"的最大 Token 数

- 例如 100 万 Token ≈ 两本《三体》的体量

**参数量（Parameters）**：

- 神经网络中所有权重（w）和偏置（b）的总数

- 参数量越大，模型理论上越"聪明"，但也更耗算力

| 参数量级 | 代表模型 |
|----------|----------|
| 70亿（7B） | Qwen2.5-7B、Llama 3.1-8B |
| 270亿（27B） | Qwen3.8-27B（开源稠密模型） |
| 670亿（67B） | DeepSeek-V3 |
| 7430亿（743B） | GLM-5.3 |
| 2.4万亿（2.4T） | Qwen3.8-Max |
| 2.8万亿（2.8T） | Kimi K3 |

---

#### 9. 推理 —— 模型如何生成回答

**自回归生成（Autoregressive）**：

1. 输入提示词（Prompt）

2. 模型预测下一个 Token 的概率分布

3. 采样选择一个 Token（选最高概率的，或按概率随机采样）

4. 将新 Token 加入上下文

5. 重复步骤 2-4，直到生成结束标记（EOS）或达到最大长度

**温度（Temperature）控制创造性**：

| 温度值 | 效果 |
|--------|------|
| 低（0.1） | 更确定、更保守，几乎总选最高概率词 |
| 高（1.0） | 更随机、更有创造性 |

**Top-p（核采样）**：只从累积概率达到 p 的最小词集中采样，过滤掉过低概率的词。

---

#### 10. 本课核心概念速查表

| 概念 | 一句话解释 |
|------|------------|
| 概率 | 描述不确定性的数学工具 |
| 条件概率 | 在已知某条件下某事发生的概率 |
| 神经网络 | 多层神经元组成的可训练函数逼近器 |
| Transformer | 基于自注意力的深度学习架构 |
| 预训练 | 在海量文本上学习语言规律 |
| SFT | 用人工标注数据让模型学会对话 |
| RLHF | 用人类偏好优化模型输出 |
| Token | 模型处理的最小文本单元 |
| 上下文窗口 | 模型能"记住"的最大 Token 数 |
| 参数量 | 模型中可训练参数的总数 |
| 自回归 | 逐个 Token 生成回答的过程 |

---

#### 11. 本课小结

- LLM 的本质是**条件概率模型**：P(下一个词 | 前文)

- **神经网络**通过**反向传播**从数据中学习这些概率

- **Transformer** 的**自注意力机制**让模型能关注上下文中的关键信息

- 训练分三步：**预训练 → SFT → RLHF**

- 推理是**自回归**过程，逐个 Token 生成

---

#### 12. 课后练习

1. 用贝叶斯公式解释：已知一个序列中 A 的含量为 30%，在 A 后面出现 G 的条件概率为 40%，求 A 和 G 同时出现的概率。

2. 阅读一篇关于 Transformer 的科普文章，用自己的话描述"注意力"是什么意思。

3. 计算：一个模型有 700 亿参数，每个参数用 2 字节存储（FP16），需要多少 GB 显存？

4. 解释为什么"上下文窗口"越大，模型能处理的任务就越复杂。

5. 用温度的概念解释：为什么同一个 Prompt 每次回答可能不同？



### 第二课：模型分类 —— 开源/闭源、稠密/MoE、本地/云端/半云端

本课目标：

- 理解开源模型与闭源模型的本质区别、各自的优劣势

- 掌握稠密模型与 MoE（混合专家）架构的核心差异

- 掌握本地部署、云端 API、半云端（WebGPU/浏览器端）三种使用方式的区分

- 了解 2026 年 8 月主流模型的分类归属

- 理解“一超多强”的全球大模型竞争格局

---

#### 1. 开源模型 vs 闭源模型

**核心区别**：

| 维度 | 开源模型（Open-weights） | 闭源模型（Closed/Proprietary） |
|------|-------------------------|-------------------------------|
| 权重是否公开 | ✅ 可下载 | ❌ 仅 API 调用 |
| 可本地部署 | ✅ 是 | ❌ 否 |
| 可自由微调 | ✅ 是 | ❌ 否 |
| 数据隐私 | 数据不出本地 | 数据需上传云端 |
| 成本结构 | 硬件成本 + 电费 | 按 Token 付费 |
| 典型代表 | DeepSeek、Qwen、GLM、Kimi K3、Llama | Claude、GPT、Gemini |

**开源模型的优势**：

- 数据主权：敏感数据不需要上传到第三方服务器[reference:0]
- 可定制：可以针对自己的数据微调模型
- 成本可预测：硬件投入固定，不像 API 按量计费随使用量增长
- 透明度：代码和权重公开，可审计

**闭源模型的优势**：

- 性能天花板更高：闭源厂商投入最大算力训练旗舰模型[reference:1]
- 无需运维：开箱即用，不需要自己部署硬件
- 持续更新：厂商会不断升级，用户无需自己操作
- 企业级服务：有 SLA 保障和技术支持

**2026 年 8 月的重要变化**：

开源模型正在快速缩小与闭源旗舰的差距。GLM-5.2（开源）在 SWE-bench Pro 上以 62.1 分首次超过了 OpenAI 旗舰 GPT-5.5 的 58.6 分[reference:2]。GLM-5.2（91.9 分）在 tessl.io 的 1000 个真实编码场景评测中综合得分高于闭源 Claude Sonnet 4.6（90.8 分）[reference:3]。

同时，阿里于 2026 年 8 月首次将原本闭源的 Max 旗舰系列开源[reference:4][reference:5]，标志着“最强模型就得闭源”的规则正在被打破[reference:6]。

---

#### 2. 稠密模型（Dense）vs MoE（混合专家）

**一句话说清**：

- **稠密模型**：来一个任务，模型的**全部参数一起上**，一个不落[reference:7]
- **MoE**：把参数拆成若干“专家”组，配一个路由调度员，每个任务只激活**部分专家**[reference:8]

**核心公式**：

```
稠密：总参数量 = 每次激活参数量（全参数参与每一次计算）
MoE：总参数量 ≫ 每次激活参数量（动态路由按需激活部分"专家"子网络）
[reference:9]
```

**直观类比**：

| 场景 | 稠密模型 | MoE 模型 |
|------|---------|----------|
| 公司有 1000 人 | 任何问题都全员讨论 | 路由分配，只让相关专家组上 |
| 写邮件 | 1000 人一起讨论 | 只叫“文案组” |
| 设计登月方案 | 1000 人一起讨论 | 叫“物理组+工程组”[reference:10] |

**实例对比**：

| 模型 | 架构 | 总参数 | 激活参数 | 激活率 |
|------|------|--------|---------|--------|
| DeepSeek V4-Pro | MoE | 1.6T | 49B | ~3.1%[reference:11] |
| Qwen3.8-27B | 稠密 | 27B | 27B | 100%[reference:12] |
| Kimi K3 | MoE | 2.8T | 104B | ~3.7%[reference:13] |
| Qwen3.8-2.4T | MoE | 2.4T | 95B | ~4.0%[reference:14] |

**MoE 为什么受欢迎**：

- 用 49B 参数的算力成本，撬动 1.6T 参数的知识容量[reference:15]
- 推理成本远低于同总参数的稠密模型[reference:16]
- 适合云端大规模部署

**稠密模型为什么还没死**：

- 部署简单，不需要复杂的路由逻辑
- 推理延迟更稳定（没有路由开销）
- 适合端侧设备（手机、平板、笔记本）
- Qwen3.6-27B（稠密）在数学和代码评测中干翻了一众比它大得多的 MoE[reference:17]

2026 年的趋势是**双轨并行**：MoE 主打云端降本，稠密坚守端侧与高可靠场景，二者并非替代，而是互补共存[reference:18]。

---

#### 3. 三种使用方式：本地 / 云端 / 半云端（WebGPU）

| 方式 | 说明 | 硬件要求 | 典型工具 | 代表模型 |
|------|------|---------|---------|---------|
| **本地部署** | 模型权重下载到自己的服务器或电脑上运行 | GPU（消费级或企业级） | Ollama、llama.cpp、vLLM、SGLang[reference:19] | Qwen3.8-27B（家用显卡可跑）[reference:20] |
| **云端 API** | 通过 HTTP 调用厂商提供的 API 接口 | 只需联网 | 各厂商 SDK、OpenRouter[reference:21] | Claude、GPT、DeepSeek API |
| **半云端（WebGPU）** | 模型在浏览器中运行，利用 GPU 加速 | 支持 WebGPU 的浏览器 | llama.cpp WebGPU 后端、Sipp[reference:22] | 量化后的小型模型 |

**本地部署的硬件门槛变化（2026 年）**：

- 消费级硬件甜点从“8-14B 稠密模型”跃升为“30-35B-A3B 的 MoE 模型”（如 Qwen3.6-35B-A3B 在 24GB 显卡上可达 120 tok/s）[reference:23]
- Qwen3.8-27B（270 亿参数）开源，家用显卡即可运行[reference:24]
- 但真正的前沿开源模型（如 DeepSeek V4 Flash 284B）本地门槛仍然很高——最激进的 Q2_K 量化也需要 103GB VRAM[reference:25]

**半云端（WebGPU）的前景**：

- 在浏览器中直接运行 GGUF 格式的模型[reference:26]
- 不需要安装任何软件，打开网页即可使用
- 数据完全在本地浏览器中处理，隐私性好
- 受限于浏览器内存和算力，目前只能运行小型量化模型

---

#### 4. 2026 年 8 月“一超多强”格局

> 注：以下信息基于 2026 年 8 月中上旬公开数据，AI 模型格局以月为单位变动[reference:27]。

**闭源阵营（付费 API）** [reference:28]：

| 厂商 | 旗舰模型 | 发布时间 | 备注 |
|------|---------|---------|------|
| Anthropic | Claude Opus 5 | 2026-07-24[reference:29] | 定价 $5/$25 每百万 Token，接近 Fable 5 能力[reference:30] |
| Anthropic | Claude Fable 5 | 2026 年 6 月 | 顶级旗舰，有安全分级机制[reference:31] |
| OpenAI | GPT-5.6 Sol / Luna | 2026 年 8 月 | Sol 支持 Ultrafast 模式，速度提升 14 倍[reference:32] |
| Google | Gemini 3.1 Pro / 3.7 Flash | 2026 年 2 月 / 8 月[reference:33][reference:34] | 支持 100 万 Token 上下文[reference:35] |

**开源阵营（开放权重）** [reference:36]：

| 模型 | 厂商 | 架构 | 总参数 | 激活参数 | 上下文 | 发布时间 |
|------|------|------|--------|---------|--------|---------|
| Qwen3.8-2.4T-A95B | 阿里 | MoE | 2.4T | 95B | 100 万[reference:37] | 2026-08[reference:38] |
| Kimi K3 | 月之暗面 | MoE | 2.8T | 104B | 100 万[reference:39] | 2026-07[reference:40] |
| GLM-5.3 | 智谱 | MoE | 7430 亿[reference:41] | — | 100 万[reference:42] | 2026-08-14[reference:43] |
| DeepSeek V4-Pro-0813 | DeepSeek | MoE | 1.6T | 49B | 100 万[reference:44] | 2026-08-13[reference:45] |
| Qwen3.8-27B | 阿里 | 稠密 | 27B | 27B | 26.2万→100万[reference:46] | 2026-08-14[reference:47] |

**多模态/垂直领域代表**：

| 模型 | 厂商 | 领域 | 说明 |
|------|------|------|------|
| MiniMax H3 | MiniMax | 视频生成 | 视频编辑能力全球第一[reference:48] |
| MiniMax Music 3.0 | MiniMax | 音乐生成 | 一次生成完成作曲、编曲[reference:49] |
| Grok 4.3 | xAI | 通用 | Grok 3 已于 2026 年 5 月弃用[reference:50] |

**闭源与开源的实力对比（2026 年 8 月 ChatBench 排行榜）** [reference:51]：

| 排名 | 模型 | 类型 | 得分 |
|------|------|------|------|
| 1 | DeepSeek V4 Flash 0731 (max) | 开源 | 74.1 |
| 2 | Qwen3.8 Max | 开源 | 72.7 |
| 3 | Claude Opus 5 (max) | 闭源 | 70.9 |
| 4 | GPT-5.6 Luna (max) | 闭源 | 70.2 |
| 8 | Kimi K3 (max) | 开源 | 68.7 |

**格局总结**：

- **“一超”** ：Anthropic（Claude 系列）在闭源领域仍被认为是能力天花板，但优势正在缩小
- **“多强”** ：DeepSeek、Qwen、GLM、Kimi 等国产开源模型在 2026 年 8 月密集发布旗舰版本，在多项基准上逼近甚至超过闭源旗舰[reference:52]
- **价格战**：DeepSeek V4-Pro 输出每百万 Token 仅 $0.87[reference:53]，远低于 Claude Opus 5 的 $25[reference:54]，成本降低约 57 倍[reference:55]

---

#### 5. 三种分类方式的交叉矩阵

| 模型 | 开源/闭源 | 稠密/MoE | 本地/云端/半云端 |
|------|----------|---------|-----------------|
| Claude Opus 5 | 闭源 | MoE（推测） | 云端 API |
| GPT-5.6 Sol | 闭源 | MoE（推测） | 云端 API |
| DeepSeek V4-Pro | 开源 | MoE | 云端 API + 可本地（需巨量显存） |
| Qwen3.8-2.4T | 开源 | MoE | 云端 API + 可本地（需巨量显存） |
| Qwen3.8-27B | 开源 | 稠密 | 本地（家用显卡可跑）+ 云端 |
| Kimi K3 | 开源 | MoE | 云端 API + 可本地（需巨量显存） |
| GLM-5.3 | 开源 | MoE | 云端 API + 可本地 |
| Grok 4.3 | 闭源 | MoE | 云端 API |

---

#### 6. 本课核心概念速查表

| 概念 | 一句话解释 |
|------|------------|
| 开源模型 | 权重公开，可下载部署 |
| 闭源模型 | 仅 API 调用，权重不公开 |
| 稠密模型 | 每次推理全部参数都参与计算 |
| MoE | 每次只激活部分“专家”，其余休眠 |
| 本地部署 | 模型在自己硬件上运行 |
| 云端 API | 通过 HTTP 调用厂商服务 |
| 半云端（WebGPU） | 在浏览器中利用 GPU 运行模型 |
| 激活参数 | 每次推理实际参与计算的参数数量 |

---

#### 7. 本课小结

- **开源 vs 闭源**：开源提供数据主权和可定制性，闭源提供最高性能和免运维。2026 年开源正快速追赶闭源

- **稠密 vs MoE**：稠密全部参数参与计算，简单稳定；MoE 只激活部分专家，总参数大但推理成本低。两者互补共存

- **本地 vs 云端 vs 半云端**：本地保数据隐私但需硬件，云端最方便但按量付费，半云端（WebGPU）在浏览器中运行，是新兴方向

- **2026 年 8 月格局**：DeepSeek、Qwen、GLM、Kimi 等国产开源模型密集发布，在多项基准上逼近甚至超过闭源旗舰，价格战进一步拉低了 AI 使用成本

---

#### 8. 课后练习

1. 用自己的话解释稠密模型和 MoE 模型的核心区别（用“公司全员”和“专家组”的类比）。

2. 查阅 Qwen3.8-27B 的硬件要求，判断你手头的电脑能否运行它。

3. 列举 3 个闭源模型和 3 个开源模型（2026 年 8 月）。

4. 解释为什么 MoE 模型的总参数可以远大于激活参数，这对成本有什么影响？

5. 如果一个企业有严格的医疗数据隐私要求，应该选择本地部署还是云端 API？为什么？



### 第三课：AidLux 上部署 Gemma 4 9B —— Ollama 实战

本课目标：

- 在 AidLux 中安装和配置 Ollama（ARM64 版本）

- 使用 Ollama 拉取并运行 Gemma 4 9B 模型

- 通过命令行与模型对话

- 通过 REST API 调用模型

- 部署 Web UI（Open WebUI）实现图形界面

- 理解模型量化与硬件适配

---

#### 1. 为什么选择 AidLux + Ollama + Gemma 4

| 组件 | 作用 | 说明 |
|------|------|------|
| AidLux | 在安卓设备上提供原生 Ubuntu 环境 | 基于 Linux 内核共享，非虚拟机[reference:0] |
| Ollama | 大模型运行框架 | 支持 ARM64，一条命令拉取并运行模型[reference:1] |
| Gemma 4 9B | Google 开源大模型 | 2026 年 4 月发布，Ollama v0.20.0 起原生支持[reference:2] |

**硬件要求（Gemma 4 9B / E4B）** ：

| 配置项 | 最低要求 | 推荐配置 |
|--------|---------|---------|
| 内存（RAM） | 10 GB | 16–24 GB[reference:3] |
| 存储空间 | 9.6 GB（模型文件） | 16 GB+[reference:4] |
| 架构 | ARM64 | ARM64 |

AidLux 默认运行在高通平台（如 QCS8550 / QCS6490），支持 GGUF 格式模型[reference:5]。如果你的安卓设备有 8GB 以上内存（近三四年内发布的旗舰或中高端机型），即可尝试部署[reference:6]。

> **注意**：如果设备内存不足 10GB，可以改用更小的 `gemma4:e2b`（7.2 GB，最低 8GB 内存）[reference:7][reference:8]。

---

#### 2. 准备工作：启动 AidLux 并进入终端

**启动 AidLux**：

1. 打开 AidLux App，等待初始化完成

2. 点击底部「终端」图标进入命令行

**或通过浏览器远程访问**：

在电脑浏览器输入 `http://平板IP:8000`，用 `aidlux`/`aidlux` 登录[reference:9]。

**检查系统信息**：

```bash
uname -a
# 输出应包含 aarch64 或 ARM64

cat /etc/os-release
# 确认是 Ubuntu 系

free -h
# 查看可用内存
```

---

#### 3. 安装 Ollama（两种方式）

##### 方式一：一键安装脚本（推荐）

Ollama 官方安装脚本同时支持 x86_64 和 ARM64[reference:10]：

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

安装完成后，Ollama 会自动以服务形式运行[reference:11]。

##### 方式二：手动安装 ARM64 包

如果一键脚本因网络问题失败，可以手动下载 ARM64 专用包[reference:12]：

```bash
# 下载 ARM64 版本
curl -fsSL https://ollama.com/download/ollama-linux-arm64.tar.zst | sudo tar x -C /usr

# 验证安装
ollama --version
```

**启动 Ollama 服务**：

```bash
# 前台运行（调试用）
ollama serve

# 或后台运行
nohup ollama serve > ollama.log 2>&1 &
```

**验证 Ollama 是否正常运行**：

```bash
ollama --version
# 应显示 v0.20.0 或更高版本（Gemma 4 需要 v0.20.0+）[reference:13]

curl http://localhost:11434
# 应返回 "Ollama is running"
```

---

#### 4. 拉取 Gemma 4 9B 模型

Ollama 中 Gemma 4 的默认标签是 `gemma4:e4b`（9.6 GB，有效参数 4.5B）[reference:14]：

```bash
ollama pull gemma4
```

**等价于**：

```bash
ollama pull gemma4:e4b
```

**可用标签一览**[reference:15]：

| 标签 | 磁盘大小 | 有效参数 | 适用场景 |
|------|---------|---------|---------|
| `gemma4:e2b` | 7.2 GB | 2.3B | 低内存设备（最低 8GB RAM） |
| `gemma4:e4b`（默认） | 9.6 GB | 4.5B | 大多数设备，最佳起点 |
| `gemma4:26b` | 18 GB | 3.8B（MoE） | 性价比最高，推理快 |
| `gemma4:31b` | 20 GB | 30.7B | 最高质量，需 24GB+ 显存 |

**拉取指定标签**：

```bash
ollama pull gemma4:e2b   # 轻量版，适合低内存设备
```

**查看已下载的模型**：

```bash
ollama list
```

---

#### 5. 运行模型并对话

**交互式对话**：

```bash
ollama run gemma4
```

输入问题后按回车，模型会生成回答。输入 `/bye` 退出。

**单次查询（非交互式）** ：

```bash
ollama run gemma4 "请解释什么是 DNA 序列的 GC 含量"
```

**查看模型信息**：

```bash
ollama show gemma4
```

---

#### 6. 通过 REST API 调用模型

Ollama 默认在 `http://localhost:11434` 提供 REST API[reference:16]。

**生成接口（/api/generate）** ：

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "gemma4",
  "prompt": "请用中文解释什么是基因",
  "stream": false
}'
```

**对话接口（/api/chat）** ：

```bash
curl http://localhost:11434/api/chat -d '{
  "model": "gemma4",
  "messages": [
    {"role": "user", "content": "什么是 CRISPR？"}
  ],
  "stream": false
}'
```

**Python 调用示例**：

```python
import requests

response = requests.post(
    "http://localhost:11434/api/generate",
    json={"model": "gemma4", "prompt": "解释一下中心法则", "stream": False}
)
print(response.json()["response"])
```

---

#### 7. 部署 Web UI（图形界面）

**方式一：Open WebUI（功能最全）**

Open WebUI 提供类似 ChatGPT 的网页界面，支持对话历史、多模型切换等。

```bash
# 安装 Docker（如未安装）
sudo apt install docker.io docker-compose -y

# 拉取并运行 Open WebUI
docker run -d -p 3000:8080 \
  -v open-webui:/app/backend/data \
  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```

启动后，在浏览器访问 `http://平板IP:3000`。

**方式二：Ollama WebUI（轻量级）**

```bash
# 安装 Node.js（如未安装）
sudo apt install nodejs npm -y

# 安装并运行 Ollama WebUI
npx ollama-webui
```

---

#### 8. 通过 Docker 一键部署（备选方案）

如果直接安装 Ollama 遇到问题，可以使用 Docker 方案[reference:17]：

```bash
# 创建项目目录
mkdir -p ~/ollama-docker
cd ~/ollama-docker

# 创建 docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3'
services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    ports:
      - "11434:11434"
    volumes:
      - ./ollama_data:/root/.ollama
    restart: unless-stopped
EOF

# 启动
docker-compose up -d

# 进入容器拉取模型
docker exec -it ollama ollama pull gemma4
```

---

#### 9. 性能优化建议

**内存不足时的应对方案**：

1. 使用更小的模型：`ollama pull gemma4:e2b`（7.2 GB）[reference:18]

2. 关闭其他 Android 后台应用释放内存

3. 使用量化版本（Ollama 默认已使用 Q4 量化）

**模型加载慢**：首次加载需要将模型从磁盘读入内存，耐心等待。之后再次运行会快一些。

**推理速度慢**：AidLux 在 ARM 设备上主要依赖 CPU 推理，Gemma 4 E4B 在纯 CPU 上大约每秒 1–3 个 Token[reference:19]。这是正常现象，移动端算力有限。

---

#### 10. 常见错误及解决

| 错误 | 原因 | 解决 |
|------|------|------|
| `ollama: command not found` | Ollama 未安装或未加入 PATH | 重新执行安装脚本，或手动将 `/usr/bin/ollama` 加入 PATH |
| `Error: model "gemma4" not found` | 模型未下载 | 执行 `ollama pull gemma4` |
| 拉取模型超时或失败 | 网络问题 | 使用代理，或换用 Docker 方案[reference:20] |
| `Segmentation fault` 或加载卡在 99% | Ollama 版本过旧 | 更新到 v0.20.0+[reference:21][reference:22] |
| 内存不足（OOM） | 设备 RAM 小于 10GB | 改用 `gemma4:e2b`[reference:23] |
| `failed to get cpu info` | AidLux 环境问题 | 重启 AidLux App 后再试 |
| Web UI 无法连接 Ollama | 端口未开放或地址不对 | 检查 `http://localhost:11434` 是否可访问 |

---

#### 11. 本课核心命令速查表

| 操作 | 命令 |
|------|------|
| 安装 Ollama（一键） | `curl -fsSL https://ollama.com/install.sh \| sh` |
| 安装 Ollama（ARM64） | `curl -fsSL https://ollama.com/download/ollama-linux-arm64.tar.zst \| sudo tar x -C /usr` |
| 启动 Ollama 服务 | `ollama serve` 或 `nohup ollama serve &` |
| 拉取 Gemma 4 默认版 | `ollama pull gemma4` |
| 拉取轻量版 | `ollama pull gemma4:e2b` |
| 交互式对话 | `ollama run gemma4` |
| 单次查询 | `ollama run gemma4 "你的问题"` |
| 查看已下载模型 | `ollama list` |
| API 调用 | `curl http://localhost:11434/api/generate -d '{"model":"gemma4","prompt":"问题"}'` |
| Docker 部署 | `docker-compose up -d` |

---

#### 12. 本课小结

- **Ollama 是 AidLux 上部署大模型最简单的方式**，一条命令安装，一条命令拉取模型

- **Gemma 4 9B（E4B）需要约 10GB 内存**，如果设备内存不足，改用 E2B（7.2GB）

- **Ollama 提供 REST API**，可用 curl 或 Python 调用，方便集成到其他应用

- **Web UI** 可通过 Open WebUI 或 Ollama WebUI 部署，获得图形化对话界面

- **ARM64 设备性能有限**，纯 CPU 推理速度较慢，但足以用于学习和实验

---

#### 13. 课后练习

1. 在 AidLux 终端中执行 `ollama --version`，确认版本是否 ≥ v0.20.0。

2. 拉取 `gemma4:e2b` 轻量版模型，运行并问一个问题。

3. 用 `curl` 调用 `/api/generate` 接口，让模型用 JSON 格式返回回答。

4. 用 Python 的 `requests` 库写一个简单的对话脚本。

5. （选做）部署 Open WebUI，在浏览器中通过图形界面与 Gemma 4 对话。


### 第四课：云端 API 调用 —— 以 DeepSeek 为例

本课目标：

- 注册 DeepSeek 开放平台账号并获取 API Key

- 理解 DeepSeek API 的兼容性（OpenAI 兼容）

- 安装 OpenAI SDK 并配置 DeepSeek 端点

- 实现基础对话、多轮对话和流式输出

- 在 AidLux 中通过 Python 调用 DeepSeek API

- 掌握核心参数（model、temperature、thinking 等）

---

#### 1. DeepSeek API 概览

DeepSeek API 使用与 OpenAI 完全兼容的接口规范[reference:0][reference:1]，这意味着你可以直接用 OpenAI SDK 调用 DeepSeek 模型，只需修改 `base_url` 和 `api_key` 两个参数[reference:2][reference:3]。

**核心信息**：

| 项目 | 值 |
|------|-----|
| API Base URL | `https://api.deepseek.com`[reference:4][reference:5] |
| Chat Completions 端点 | `https://api.deepseek.com/v1/chat/completions`[reference:6] |
| 认证方式 | Bearer Token（API Key）[reference:7] |
| 模型 ID | `deepseek-v4-pro`（旗舰版，1.6T 总参数/49B 激活）[reference:8] |
| 模型 ID | `deepseek-v4-flash`（轻量版，284B 总参数/13B 激活）[reference:9] |
| 上下文窗口 | 100 万 Token[reference:10] |

**重要日期**：
- 旧模型 ID `deepseek-chat` 和 `deepseek-reasoner` 已于 2026 年 7 月 24 日弃用[reference:11]
- 2026 年 8 月 13 日起，V4-Pro 正式版已上线[reference:12]
- 2026 年 8 月 16 日 16:00（UTC）起执行新的分时计费[reference:13]

---

#### 2. 注册与获取 API Key

**步骤 1：注册账号**

访问 [DeepSeek 开放平台](https://platform.deepseek.com)[reference:14][reference:15]。使用手机号或邮箱注册，并完成实名认证[reference:16]。未实名账号仅开放极小测试额度[reference:17]。

**步骤 2：充值**

调用 API 前，账户需有至少 $2 余额，否则返回 `402 Insufficient Balance`[reference:18]。

**步骤 3：创建 API Key**

1. 登录后点击右上角 **"API Keys"**[reference:19]
2. 点击 **"Create new secret key"**[reference:20][reference:21]
3. 输入名称（如 "chat"）[reference:22]
4. 创建后 **立即保存**，Key 仅在创建时显示一次[reference:23]

**安全建议**：
- 使用项目级密钥（Project-scoped keys）而非账号级密钥[reference:24]
- 将 API Key 设为环境变量，不要硬编码在代码中[reference:25]

---

#### 3. 安装与配置

**安装 OpenAI SDK**：

```bash
pip install openai>=1.30.0
```

**设置环境变量**（推荐）：

```bash
export DEEPSEEK_API_KEY="sk-你的API密钥"
```

**验证配置**（curl 测试）：

```bash
curl https://api.deepseek.com/v1/chat/completions \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-v4-pro",
    "messages": [{"role": "user", "content": "用一句话解释什么是MoE"}]
  }'
```

成功会返回包含 `choices[0].message.content` 的 JSON[reference:26]。

---

#### 4. Python 基础调用

```python
from openai import OpenAI

# 初始化客户端（指向 DeepSeek 端点）
client = OpenAI(
    api_key="你的API密钥",  # 或 os.environ.get("DEEPSEEK_API_KEY")
    base_url="https://api.deepseek.com"  # 关键：替换默认端点[reference:27]
)

# 发送对话请求
response = client.chat.completions.create(
    model="deepseek-v4-pro",  # 或 deepseek-v4-flash
    messages=[
        {"role": "system", "content": "你是一个专业的生物信息学助手"},
        {"role": "user", "content": "解释一下DNA的GC含量为什么重要"}
    ],
    temperature=1.0,  # DeepSeek 推荐值[reference:28]
    top_p=1.0         # DeepSeek 推荐值[reference:29]
)

# 提取回复
print(response.choices[0].message.content)
```

---

#### 5. 多轮对话（上下文拼接）

DeepSeek API 是**无状态**的，每次请求必须携带完整对话历史[reference:30]。

```python
from openai import OpenAI

client = OpenAI(
    api_key="你的API密钥",
    base_url="https://api.deepseek.com"
)

# 初始化消息列表
messages = [
    {"role": "system", "content": "你是一个基因科学助手"}
]

# 第一轮
messages.append({"role": "user", "content": "什么是CRISPR？"})
response = client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=messages
)
# 将模型回复加入历史[reference:32]
messages.append(response.choices[0].message)

# 第二轮（基于上一轮上下文）
messages.append({"role": "user", "content": "它有哪些应用？"})
response = client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=messages
)
messages.append(response.choices[0].message)

print(response.choices[0].message.content)
```

---

#### 6. 流式输出（Streaming）

流式输出产生“打字机”效果，提升用户体验[reference:34]。

```python
from openai import OpenAI

client = OpenAI(
    api_key="你的API密钥",
    base_url="https://api.deepseek.com"
)

response = client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=[{"role": "user", "content": "写一段关于基因编辑的简介"}],
    stream=True  # 开启流式[reference:35]
)

# 逐块接收
for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

---

#### 7. 核心参数详解

| 参数 | 类型 | 说明 |
|------|------|------|
| `model` | string | `deepseek-v4-pro` 或 `deepseek-v4-flash`[reference:36] |
| `messages` | array | 对话消息列表，role 为 `system`/`user`/`assistant` |
| `temperature` | float (0-2) | 默认 1.0，越高越随机[reference:37] |
| `top_p` | float (≤1) | 默认 1.0，核采样[reference:38] |
| `max_tokens` | integer | 生成的最大 Token 数[reference:39] |
| `stream` | boolean | 是否流式输出[reference:40] |
| `thinking.reasoning_effort` | string | `low`/`high`/`max`，控制思考深度[reference:41] |
| `user_id` | string | 用户标识，用于安全审查和缓存隔离[reference:42] |

**thinking 模式说明**：

- `low`：简单任务快速响应
- `high`：日常 Agent 任务（默认）[reference:43]
- `max`：复杂推理场景[reference:44]

**注意**：`deepseek-v4-pro` 目前只支持 `high` 和 `max`，`low` 会被视为 `high`[reference:45]。

---

#### 8. 在 AidLux 中调用 DeepSeek API

在 AidLux 终端中操作（与 Ubuntu 完全一致）：

```bash
# 1. 安装 OpenAI SDK
pip install openai

# 2. 设置 API Key（替换为你的密钥）
export DEEPSEEK_API_KEY="sk-你的密钥"

# 3. 创建 Python 脚本
cat > deepseek_demo.py << 'EOF'
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

response = client.chat.completions.create(
    model="deepseek-v4-pro",
    messages=[{"role": "user", "content": "AidLux是什么？"}]
)
print(response.choices[0].message.content)
EOF

# 4. 运行
python3 deepseek_demo.py
```

**AidLux 上的注意事项**：
- 确保平板已连接 Wi-Fi
- API 调用不依赖本地算力，速度取决于网络
- 比本地运行 Ollama 快得多（本地约 1 token/s，云端 API 快数十倍）[reference:46]

---

#### 9. 定价与成本优化（2026 年 8 月）

DeepSeek V4 采用**分时计费**机制[reference:47]：

| 时段 | 价格 |
|------|------|
| 高峰时段 | 标准价格 |
| 低谷时段 | **半价**[reference:48] |

新价格于 2026 年 8 月 16 日 16:00（UTC）生效[reference:49]。

**成本优化技巧**：

1. **Prompt Caching**：长 System Prompt 命中缓存后费用大幅降低[reference:50]
2. **精简上下文**：只保留必要的对话历史[reference:51]
3. **选择合适模型**：简单任务用 `deepseek-v4-flash`（更便宜）
4. **批量任务低谷期运行**：离线任务安排在低谷时段[reference:52]

---

#### 10. 常见错误与解决

| 错误 | 原因 | 解决 |
|------|------|------|
| `402 Insufficient Balance` | 账户余额不足 | 充值至少 $2[reference:53] |
| `401 Unauthorized` | API Key 无效或过期 | 检查 Key 是否正确，重新生成 |
| `Rate limit exceeded (429)` | 请求频率超限 | 实现指数退避重试[reference:54] |
| 超时（Timeout） | 复杂推理耗时较长 | 设置 timeout ≥ 60s[reference:55] |
| `model not found` | 使用了已弃用的模型名 | 改用 `deepseek-v4-pro` 或 `deepseek-v4-flash`[reference:56] |
| `User not verified` | 未完成实名认证 | 完成实名认证[reference:57] |

---

#### 11. 本课核心命令速查表

| 操作 | 命令/代码 |
|------|-----------|
| 安装 SDK | `pip install openai>=1.30.0` |
| 设置环境变量 | `export DEEPSEEK_API_KEY="sk-..."` |
| 初始化客户端 | `OpenAI(api_key=..., base_url="https://api.deepseek.com")` |
| 基础对话 | `client.chat.completions.create(model="deepseek-v4-pro", messages=[...])` |
| 流式输出 | 添加 `stream=True` 参数 |
| curl 测试 | `curl https://api.deepseek.com/v1/chat/completions -H "Authorization: Bearer $KEY" -d '{...}'` |

---

#### 12. 本课小结

- **DeepSeek API 兼容 OpenAI 格式**，用 OpenAI SDK 即可调用[reference:58]
- **API Key 是调用凭证**，在 platform.deepseek.com 创建并妥善保存[reference:59]
- **多轮对话需手动拼接历史**，API 本身无状态[reference:60]
- **流式输出**提升用户体验，适合聊天应用[reference:61]
- **分时计费**鼓励低谷期运行批量任务[reference:62]
- **AidLux 中调用云端 API**比本地运行模型快得多[reference:63]

---

#### 13. 课后练习

1. 注册 DeepSeek 开放平台，充值 $2，创建 API Key。

2. 在 AidLux 终端中安装 OpenAI SDK，用 `curl` 测试 API 是否正常。

3. 写一个 Python 脚本，让 DeepSeek 用中文解释“中心法则”。

4. 实现多轮对话：第一轮问“什么是基因？”，第二轮追问“它和 DNA 有什么关系？”。

5. 开启 `stream=True`，观察输出效果，对比非流式输出。

6. 尝试切换 `model="deepseek-v4-flash"`，对比响应速度和回答质量。

7. （选做）将 DeepSeek API 集成到之前写的基因浏览器中，替换本地模型。



### 第五课：本地模型接入程序与云端 API 网关设计

本课目标：

- 将本地运行的 Ollama 模型封装为可调用的 Python/后端服务模块

- 设计统一的 API 网关，实现本地模型与云端模型的无缝切换

- 掌握适配器模式（本地适配器 / 云端适配器）

- 设计健壮的 Chat Completions 风格端口（兼容 OpenAI 格式）

- 理解超时、重试、流式转换等生产级细节

- 简略带过半云端（WebGPU/浏览器本地推理）方案

---

#### 1. 整体架构：应用如何接入大模型

无论本地还是云端，大模型接入程序的标准姿势是 **HTTP API**。

```
你的应用程序（Python/JS/Java）
        ↓
统一网关接口（/v1/chat/completions）
        ↓
   ┌────┴────┐
本地适配器    云端适配器
（Ollama）   （DeepSeek/OpenAI）
```

**核心原则**：
- 程序不直接调 Ollama 或 DeepSeek，而是调自己设计的网关
- 网关内部根据配置（或请求参数）路由到对应的适配器
- 适配器负责请求格式转换 + 响应格式统一

---

#### 2. 封装本地 Ollama 为 Python 模块（接入程序的第一步）

Ollama 已提供 HTTP API，我们只需要用 `requests` 封装即可。

**最简封装（非流式）**：

```python
import requests
import json

class LocalOllamaClient:
    def __init__(self, base_url="http://localhost:11434", model="gemma4"):
        self.base_url = base_url
        self.model = model

    def chat(self, messages, stream=False, temperature=0.7):
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": stream,
            "options": {"temperature": temperature}
        }
        resp = requests.post(
            f"{self.base_url}/api/chat",
            json=payload,
            timeout=120  # 本地推理可能较慢
        )
        resp.raise_for_status()
        if not stream:
            return resp.json()["message"]["content"]
        # 流式处理见下文
        return resp
```

**调用示例**：

```python
client = LocalOllamaClient(model="gemma4:e4b")
reply = client.chat([
    {"role": "user", "content": "解释什么是基因"}
])
print(reply)
```

**流式封装（SSE 逐块输出）**：

```python
def chat_stream(self, messages):
    payload = {"model": self.model, "messages": messages, "stream": True}
    resp = requests.post(f"{self.base_url}/api/chat", json=payload, stream=True)
    for line in resp.iter_lines():
        if line:
            chunk = json.loads(line.decode('utf-8'))
            if "message" in chunk:
                yield chunk["message"]["content"]
```

**集成到 Web 后端（FastAPI 示例）**：

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI()
llm = LocalOllamaClient()

class ChatRequest(BaseModel):
    messages: List[dict]
    stream: bool = False

@app.post("/v1/chat/completions")
async def chat_endpoint(req: ChatRequest):
    try:
        if req.stream:
            # 流式响应需用 StreamingResponse
            return StreamingResponse(llm.chat_stream(req.messages), media_type="text/event-stream")
        reply = llm.chat(req.messages)
        return {"choices": [{"message": {"content": reply}}]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

#### 3. 统一网关设计（核心：支持本地 ↔ 云端无缝切换）

**为什么需要网关**：

| 需求 | 说明 |
|------|------|
| 切换模型 | 生产用云端（快），调试用本地（免费） |
| 统一计费/审计 | 所有请求经过同一入口，便于日志和限流 |
| 渐进式迁移 | 先上线本地，性能不够再切云端，程序无需改动 |
| A/B 测试 | 部分流量走本地，部分走云端，对比效果 |

**环境变量配置（切换开关）**：

```bash
# 在 AidLux 或服务器中设置
export LLM_PROVIDER="local"      # 或 "cloud"
export LOCAL_MODEL="gemma4:e4b"
export CLOUD_MODEL="deepseek-v4-pro"
export DEEPSEEK_API_KEY="sk-xxx"
```

**统一配置读取模块（config.py）**：

```python
import os

class Config:
    PROVIDER = os.getenv("LLM_PROVIDER", "local")
    LOCAL_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
    LOCAL_MODEL = os.getenv("LOCAL_MODEL", "gemma4")
    CLOUD_BASE = os.getenv("CLOUD_BASE", "https://api.deepseek.com")
    CLOUD_MODEL = os.getenv("CLOUD_MODEL", "deepseek-v4-pro")
    CLOUD_KEY = os.getenv("DEEPSEEK_API_KEY")
```

---

#### 4. 适配器模式（将不同后端标准化）

**定义统一接口（抽象基类）**：

```python
from abc import ABC, abstractmethod

class LLMAdapter(ABC):
    @abstractmethod
    def chat_completions(self, messages, stream=False, **kwargs):
        pass
```

**本地适配器（Ollama）**：

```python
class OllamaAdapter(LLMAdapter):
    def __init__(self, base_url, model):
        self.base_url = base_url
        self.model = model

    def chat_completions(self, messages, stream=False, **kwargs):
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": stream,
            "options": {k: v for k, v in kwargs.items() if k in ["temperature", "top_p"]}
        }
        resp = requests.post(f"{self.base_url}/api/chat", json=payload, stream=stream, timeout=180)
        resp.raise_for_status()

        if not stream:
            return {"content": resp.json()["message"]["content"]}
        else:
            return self._stream_parse(resp)

    def _stream_parse(self, response):
        for line in response.iter_lines():
            if line:
                chunk = json.loads(line)
                if "message" in chunk:
                    yield chunk["message"]["content"]
```

**云端适配器（DeepSeek / OpenAI）**：

```python
from openai import OpenAI

class CloudAdapter(LLMAdapter):
    def __init__(self, api_key, base_url, model):
        self.client = OpenAI(api_key=api_key, base_url=base_url)
        self.model = model

    def chat_completions(self, messages, stream=False, **kwargs):
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            stream=stream,
            temperature=kwargs.get("temperature", 1.0),
            top_p=kwargs.get("top_p", 1.0)
        )
        if not stream:
            return {"content": response.choices[0].message.content}
        else:
            return self._stream_parse(response)

    def _stream_parse(self, response):
        for chunk in response:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
```

**工厂函数（根据配置返回适配器）**：

```python
def get_adapter(provider=None):
    provider = provider or Config.PROVIDER
    if provider == "local":
        return OllamaAdapter(Config.LOCAL_URL, Config.LOCAL_MODEL)
    elif provider == "cloud":
        if not Config.CLOUD_KEY:
            raise ValueError("Missing Cloud API Key")
        return CloudAdapter(Config.CLOUD_KEY, Config.CLOUD_BASE, Config.CLOUD_MODEL)
    else:
        raise ValueError(f"Unknown provider: {provider}")
```

---

#### 5. 网关端口设计（RESTful 风格）

**推荐路由设计（兼容 OpenAI 格式）**：

| 方法 | 端点 | 功能 |
|------|------|------|
| POST | `/v1/chat/completions` | 对话补全（核心） |
| GET | `/v1/models` | 列出可用模型 |
| POST | `/v1/completions` | 旧版补全（可选） |

**请求体结构（JSON）**：

```json
{
  "model": "gemma4",          // 或 deepseek-v4-pro，由网关转发
  "messages": [
    {"role": "system", "content": "You are a biologist"},
    {"role": "user", "content": "Explain PCR"}
  ],
  "stream": false,
  "temperature": 0.7,
  "max_tokens": 1024
}
```

**响应体结构（统一）**：

```json
{
  "id": "chatcmpl-xxx",
  "model": "gemma4",
  "choices": [
    {
      "index": 0,
      "message": {"role": "assistant", "content": "PCR stands for..."},
      "finish_reason": "stop"
    }
  ],
  "usage": {"prompt_tokens": 10, "completion_tokens": 50, "total_tokens": 60}
}
```

**FastAPI 完整网关实现**：

```python
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
import time
import uuid

app = FastAPI(title="LLM Gateway")

@app.post("/v1/chat/completions")
async def chat_completions(request: Request):
    body = await request.json()
    messages = body.get("messages", [])
    stream = body.get("stream", False)
    model_hint = body.get("model", Config.LOCAL_MODEL)
    temperature = body.get("temperature", 0.7)

    # 可根据 model_hint 动态选择 adapter，或固定使用环境变量
    adapter = get_adapter()
    try:
        result = adapter.chat_completions(messages, stream=stream, temperature=temperature)
        if stream:
            # 将生成器转换为 SSE 流
            return StreamingResponse(result, media_type="text/event-stream")
        else:
            # 组装 OpenAI 格式响应
            resp_json = {
                "id": f"chatcmpl-{uuid.uuid4().hex[:8]}",
                "model": model_hint,
                "choices": [
                    {"index": 0, "message": {"role": "assistant", "content": result["content"]}, "finish_reason": "stop"}
                ],
                "usage": {"total_tokens": 0}  # 可自行计算或省略
            }
            return JSONResponse(resp_json)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/v1/models")
async def list_models():
    return {
        "object": "list",
        "data": [
            {"id": Config.LOCAL_MODEL, "object": "model", "type": "local"},
            {"id": Config.CLOUD_MODEL, "object": "model", "type": "cloud"}
        ]
    }
```

---

#### 6. 健壮性设计（超时、重试、熔断）

| 问题 | 解决方案 | 实现 |
|------|----------|------|
| 本地模型卡死/超时 | 设置较长的 read_timeout（180s） | `requests.post(timeout=180)` |
| 云端 API 限流（429） | 指数退避重试 | `retry` 库或 `tenacity` |
| 本地 OOM 崩溃 | 捕获异常后 fallback 到云端 | try-except 中调用备用适配器 |
| 流式断开 | 捕获生成器异常，记录日志 | `try/except` 包裹 yield |

**重试示例（tenacity）**：

```python
from tenacity import retry, wait_exponential, stop_after_attempt

@retry(wait=wait_exponential(multiplier=1, min=2, max=10), stop=stop_after_attempt(3))
def call_cloud_safe(adapter, messages):
    return adapter.chat_completions(messages)
```

**本地故障自动降级云端**：

```python
def get_resilient_response(messages):
    try:
        local = OllamaAdapter(...)
        return local.chat_completions(messages)
    except Exception as e:
        print(f"Local failed: {e}, falling back to cloud")
        cloud = CloudAdapter(...)
        return cloud.chat_completions(messages)
```

---

#### 7. 使用统一网关启动服务（生产级命令）

**在 AidLux 中启动网关**：

```bash
# 安装依赖
pip install fastapi uvicorn requests openai tenacity

# 设置环境变量
export LLM_PROVIDER="local"
export OLLAMA_URL="http://localhost:11434"
export LOCAL_MODEL="gemma4:e4b"

# 启动服务（监听 8000 端口）
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 1
```

**测试网关**：

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"stream":false}'
```

**切换到云端（无需改代码）**：

```bash
export LLM_PROVIDER="cloud"
export DEEPSEEK_API_KEY="sk-xxx"
# 重启 uvicorn 即可
```

---

#### 8. 半云端（WebGPU）带一嘴

- **本质**：模型通过 WebGPU 在浏览器端运行（如 Transformers.js / WebLLM）
- **适合场景**：离线轻量问答、隐私极度敏感场景（数据完全不出浏览器）
- **局限**：模型大小受限于浏览器内存（通常 < 4B 量化版），推理速度不如云端
- **接入方式**：前端 JS 直接调用，不走后端网关，作为网关的一种“边缘节点”补充

**代码示意（前端）**：

```javascript
import { pipeline } from '@xenova/transformers';
const pipe = await pipeline('text-generation', 'onnx-community/gemma4-e2b');
const output = await pipe('What is DNA?', { max_new_tokens: 100 });
```

无需后端，完全前端推理。

---

#### 9. 本课核心设计模式速查表

| 设计目标 | 实现手段 |
|----------|----------|
| 统一入口 | FastAPI 网关 + `/v1/chat/completions` |
| 多后端支持 | 适配器模式（OllamaAdapter / CloudAdapter） |
| 运行时切换 | 环境变量 `LLM_PROVIDER` |
| 健壮性 | 超时（180s）+ 指数退避重试 + 故障降级 |
| 兼容性 | 请求/响应格式对齐 OpenAI Chat Completions |

---

#### 10. 常见问题及解决

| 问题 | 解决 |
|------|------|
| 本地 Ollama 未启动导致网关报错 | 启动前检查 `ollama ps`，或用 `try-except` 自动降级云端 |
| 流式响应前端无法解析 | 网关需返回 `text/event-stream` 格式，每块以 `data: {json}\n\n` 分隔 |
| 云端 Key 泄露风险 | 使用环境变量或 Vault，严禁硬编码 |
| 切换 provider 后未生效 | 重启 uvicorn 或使用热重载配置（如 `watchfiles`） |
| 多用户并发时本地模型排队 | 使用 `asyncio` 异步，或限制并发数（本地模型只适合单路或低并发） |

---

#### 11. 课后练习

1. 基于本课代码，在 AidLux 中启动一个完整的 FastAPI 网关，让本地 Ollama 提供服务。

2. 用 `curl` 测试 `/v1/chat/completions` 接口，观察流式和非流式的区别。

3. 修改环境变量 `LLM_PROVIDER=cloud`，测试切换到 DeepSeek 云端。

4. 在网关中增加日志中间件，记录每次请求的耗时和 Token 数。

5. 在前端基因浏览器的 JS 中，将 `fetch` 目标从 Worker 改为这个本地网关的 `/v1/chat/completions`，实现“基因问答助手”功能。

6. （选做）实现故障降级：优先调本地，本地失败自动调云端，并返回给前端哪个模型回复的。


### 第六课：模型微调 —— 概念速览（只讲不练）

本课目标：

- 理解微调（Fine-tuning）是什么、为什么需要微调

- 区分预训练、微调、指令微调、RLHF 的关系

- 掌握全量微调与参数高效微调（PEFT/LoRA）的核心区别

- 了解微调所需的数据格式（Alpaca / ShareGPT）

- 熟悉常见的微调工具和框架名称

- 清楚微调的基本流程（数据准备 → 加载 → 训练 → 评估）

- 本课全程无代码实操，仅建立概念认知，为后续自学铺垫

---

#### 1. 预训练 vs 微调（核心区别）

| 阶段 | 目标 | 数据量 | 算力成本 | 产出 |
|------|------|--------|---------|------|
| 预训练 | 学习通用语言规律和世界知识 | TB 级（全网文本） | 极高（千万级人民币） | 基座模型（Base Model） |
| 微调 | 让模型适应特定任务或领域 | KB–GB 级（任务数据） | 低（单卡–多卡可跑） | 任务专用模型 |
| 指令微调 | 让模型学会遵循指令进行对话 | 10 万–百万级高质量问答对 | 中 | 对话模型（Chat Model） |

**一句话说清**：预训练是“读完大学所有教材”，微调是“专攻生物信息学方向，读完该领域文献”。

---

#### 2. 微调的分类（按数据量和方式）

| 分类 | 说明 | 适用场景 |
|------|------|----------|
| 全量微调（Full Fine-tuning） | 更新模型所有参数 | 算力充裕、数据充足（数万条以上） |
| 指令微调（Instruction Tuning） | 仅用指令-回复对训练，不更新知识库 | 提升对话能力和指令遵循能力 |
| 领域微调（Domain Adaptation） | 用领域语料（如生物医学论文）继续预训练 | 让模型掌握专业术语和领域知识 |
| 任务微调（Task-specific） | 用特定任务数据（如分类、摘要）微调 | 单一任务性能优化 |

---

#### 3. 参数高效微调（PEFT）—— 用 1% 成本做 90% 的事

全量微调一个 7B 模型需要约 28GB 显存，27B 模型需要超 100GB。PEFT 只训练极少量参数，大幅降低门槛。

| 方法 | 核心思想 | 训练参数占比 | 显存需求（7B） |
|------|----------|-------------|----------------|
| LoRA（Low-Rank Adaptation） | 在权重矩阵旁添加低秩旁路，只训练旁路 | ~0.1%–0.5% | ~16GB |
| QLoRA | LoRA + 4-bit 量化基座 | ~0.1% | ~8GB（单卡可跑） |
| Adapter | 在每层插入小型可训练网络 | ~1–3% | ~20GB |
| Prefix Tuning | 在输入前添加可训练前缀向量 | <0.1% | ~14GB |

**LoRA 原理公式**：

```
W_final = W_base + A × B
```
- `W_base`：原始预训练权重（冻结，不更新）
- `A` 和 `B`：可训练的低秩矩阵（极小，替代全量更新）

效果：用千分之一的参数量，达到全量微调 90%+ 的性能。

---

#### 4. 微调数据格式（如何准备数据）

**Alpaca 格式（最通用）**：

```json
[
  {
    "instruction": "解释什么是DNA的GC含量",
    "input": "",
    "output": "GC含量是指DNA分子中鸟嘌呤（G）和胞嘧啶（C）所占的百分比..."
  },
  {
    "instruction": "根据以下序列计算GC含量",
    "input": "ATCGATCGATCG",
    "output": "该序列长度为12，GC含量为50%"
  }
]
```

**ShareGPT 格式（多轮对话）**：

```json
[
  {
    "conversations": [
      {"from": "human", "value": "什么是基因？"},
      {"from": "gpt", "value": "基因是DNA分子上具有遗传效应的片段..."},
      {"from": "human", "value": "它由什么组成？"},
      {"from": "gpt", "value": "基因由A、T、C、G四种碱基组成..."}
    ]
  }
]
```

**数据量级参考**：

| 场景 | 推荐数据量 | 质量要求 |
|------|-----------|----------|
| 简单指令微调 | 5,000–50,000 条 | 高（需人工校验） |
| 领域知识注入 | 50,000–200,000 条 | 中（可从论文/教材抽取） |
| 复杂推理微调 | 10,000–30,000 条 | 极高（需详细思维链标注） |

---

#### 5. 微调基本流程（五步走）

| 步骤 | 操作 | 输入 | 输出 |
|------|------|------|------|
| 1. 数据准备 | 收集/清洗/格式化数据 | 原始文本 | JSONL 格式数据集 |
| 2. 加载基座模型 | 从 Hugging Face 或本地加载 | 模型 ID 或路径 | 加载进内存的模型对象 |
| 3. 配置 LoRA | 指定 rank、alpha、目标模块 | 超参数 | LoRA 配置对象 |
| 4. 训练 | 用 Trainer 或 SFTTrainer 跑训练 | 数据集 + 模型 | 保存 LoRA 权重（adapter 文件） |
| 5. 评估与导出 | 在验证集评测，合并权重 | 基座模型 + LoRA | 完整微调模型 或 继续用 LoRA |

---

#### 6. 常用微调工具与框架（只列名字，不操作）

| 工具 | 说明 | 适用场景 |
|------|------|----------|
| Hugging Face TRL（SFTTrainer） | 官方指令微调库，支持 LoRA | 通用，最主流 |
| Unsloth | 极速微调库，2–5 倍速度提升 | 追求效率，商用友好 |
| LlamaFactory | 国产 WebUI 微调平台 | 非程序员也可操作 |
| Axolotl | YAML 配置驱动微调 | 大型实验管理 |
| Firefly | 阿里开源中文微调框架 | 中文场景 |
| QLoRA 原生实现 | 4-bit 量化 + LoRA 组合 | 消费级显卡跑 70B 模型 |

---

#### 7. 微调 vs RLHF vs 上下文学习（同场对比）

| 方式 | 原理 | 成本 | 效果 | 适用 |
|------|------|------|------|------|
| 微调（Fine-tuning） | 更新模型权重 | 高（需算力） | 永久性改变模型行为 | 领域专精 |
| RLHF | 基于人类偏好优化输出 | 极高（需标注排序） | 更自然、更安全 | 对话对齐 |
| 上下文学习（In-Context Learning） | 在 Prompt 中给示例（Few-shot） | 低（仅 Token 成本） | 临时行为改变 | 快速适配、原型测试 |

**决策建议**：
- 能用 Few-shot 解决的，不微调
- 需要模型永久掌握领域知识的，做微调
- 需要“更懂人话”的，上 RLHF（需要大量标注）

---

#### 8. 微调的伦理与陷阱（知道就好）

| 风险 | 说明 |
|------|------|
| 灾难性遗忘（Catastrophic Forgetting） | 微调后模型可能忘记通用能力（用混合通用数据+领域数据可缓解） |
| 数据泄露 | 微调用到的数据若含敏感信息，模型可能“记住”并泄露 |
| 安全对齐被破坏 | 过度微调可能削弱模型原有的安全护栏 |
| 评估偏差 | 在微调数据分布上评估会高估实际泛化能力 |

**最佳实践**：
- 微调数据中混入 5–10% 通用指令数据，防止遗忘
- 不在微调数据中使用真实个人隐私信息
- 微调后在多维度基准（通用 + 领域）上测试

---

#### 9. 本课核心概念速查表

| 概念 | 一句话解释 |
|------|------------|
| 微调 | 在预训练模型基础上用少量数据更新参数，适应特定任务 |
| 全量微调 | 更新所有参数，效果好但贵 |
| LoRA | 冻结原模型，只训练低秩旁路，用 1% 参数量达到 90% 性能 |
| QLoRA | LoRA + 4-bit 量化，能在 8GB 显卡跑 7B 模型微调 |
| Alpaca 格式 | 指令微调的标准 JSON 数据格式 |
| SFTTrainer | Hugging Face 最主流的微调训练器 |
| 灾难性遗忘 | 微调后丢失通用知识的现象 |
| 上下文学习 | 不更新权重，仅靠 Prompt 示例完成新任务 |

---

#### 10. 本课小结

- **微调让通用模型变“领域专家”**，本课只讲概念，不操作
- **全量微调**效果好但吃算力，**LoRA/QLoRA** 是平民玩家的首选
- **数据是微调的命脉**，Alpaca/ShareGPT 格式是最通用的结构
- **工具链成熟**：TRL + Unsloth + LlamaFactory，选一个入门即可
- **微调前先问自己**：Few-shot 够不够？不够才微调
- **本附录（附录 5）至此完结**：从概率原理 → 模型分类 → 本地部署（Ollama + Gemma） → 云端 API（DeepSeek） → 网关封装 → 微调概念，覆盖了 AI 大模型的完整知识链路

---

#### 11. 课后练习（思考题，不写代码）

1. 有一批 5,000 条生物医学问答数据，你想让模型掌握该领域知识。选择全量微调还是 LoRA？为什么？

2. 微调和 Few-shot 上下文学习，你会在什么情况下优先选择后者？

3. 若你的设备只有 8GB 显存，想微调 7B 模型，应该选择什么方案？

4. 为什么微调数据中要混入一定比例的通用指令数据？

5. 列举 3 个微调工具和 3 种微调数据格式。

## 附录 6

### 第一课：生物数据核心数据库与Python生态总览

本课目标：

- 认识三大生物信息学核心数据库：NCBI、UniProt、PDB

- 理解各数据库的核心数据类型的区别

- 掌握用 Biopython 与三大数据库交互的通用流程

- 配置好 Python 环境与必要库

- 理解 NCBI Entrez 的使用规范（邮箱、频率限制）

---

#### 1. 三大数据库概览

| 数据库 | 全称 | 数据类型 | 典型用途 | 访问方式 |
|--------|------|----------|----------|----------|
| NCBI | 美国国家生物技术信息中心 | 核酸序列、蛋白序列、文献、基因组、SNP等 | 基因序列检索、BLAST比对、文献检索 | Entrez E-utilities (Biopython) |
| UniProt | 通用蛋白质资源 | 蛋白质序列、功能注释、结构域、GO术语 | 蛋白质功能分析、序列注释 | REST API |
| PDB | 蛋白质数据银行 | 三维结构（原子坐标） | 结构生物学、分子对接、药物设计 | REST API + FTP |

**一句话总结**：
- NCBI → **序列**（DNA/RNA/蛋白质）和**文献**
- UniProt → **蛋白质功能**（注释、结构域、通路）
- PDB → **三维结构**（原子坐标）

---

#### 2. Python 生态工具链

| 库 | 用途 | 安装命令 |
|----|------|----------|
| `biopython` | NCBI Entrez 交互、序列处理、PDB解析 | `pip install biopython` |
| `requests` | 通用HTTP请求（UniProt API、PDB API） | `pip install requests` |
| `pandas` | 数据处理（TSV/CSV） | `pip install pandas` |

**验证安装**：

```python
import Bio
import requests
import pandas as pd
print(Bio.__version__)  # 应显示版本号
```

---

#### 3. NCBI Entrez 使用规范（非常重要）

NCBI 对编程访问有严格限制，必须遵守：

| 规范 | 要求 |
|------|------|
| 设置邮箱 | 必须设置，用于问题追踪 |
| 频率限制 | 无API Key：每秒3次请求；有API Key：每秒10次请求[reference:0] |
| 重试机制 | Biopython自动处理，默认最多3次，间隔15秒[reference:1] |
| 批量请求 | 用逗号分隔多个ID，减少请求次数 |

**基础配置模板**：

```python
from Bio import Entrez

# 必须设置（替换为真实邮箱）
Entrez.email = "your_email@example.com"

# 可选：设置API Key（在NCBI账号中申请）
# Entrez.api_key = "your_api_key_here"

# 可选：设置工具名称
Entrez.tool = "MyBioinformaticsScript"
```

**注意**：`Entrez.email` 必须在所有 Entrez 调用之前设置，否则会报错[reference:2][reference:3]。

---

#### 4. Entrez 核心函数速查表

| 函数 | 用途 | 示例 |
|------|------|------|
| `Entrez.esearch()` | 搜索数据库，返回ID列表[reference:4] | `Entrez.esearch(db="nucleotide", term="human insulin")` |
| `Entrez.efetch()` | 根据ID获取完整记录[reference:5] | `Entrez.efetch(db="nucleotide", id="NM_000207", rettype="fasta")` |
| `Entrez.esummary()` | 获取摘要信息[reference:6] | `Entrez.esummary(db="pubmed", id="12345")` |
| `Entrez.elink()` | 查找相关链接[reference:7] | `Entrez.elink(dbfrom="protein", db="gene", id="P01308")` |
| `Entrez.einfo()` | 获取数据库信息[reference:8] | `Entrez.einfo(db="nucleotide")` |
| `Entrez.read()` | 解析XML结果为Python对象[reference:9] | `Entrez.read(handle)` |

**可查询的数据库列表**：`pubmed`、`nucleotide`、`protein`、`gene`、`taxonomy`、`assembly`、`bioproject`、`sra` 等[reference:10]。

---

#### 5. 三种数据库的访问方式对比

| 数据库 | 推荐方式 | 库/工具 |
|--------|----------|---------|
| NCBI | Biopython Entrez | `Bio.Entrez` |
| UniProt | REST API (requests) | 直接调用 `rest.uniprot.org` |
| PDB | Biopython PDBList / REST API | `Bio.PDB.PDBList` 或 `requests` |

---

#### 6. 本课小结

- **NCBI** 用 `Bio.Entrez` 访问，需设置邮箱和遵守频率限制
- **UniProt** 用 REST API，直接 `requests.get("https://rest.uniprot.org/...")`
- **PDB** 用 `Bio.PDB.PDBList` 下载，或用 `requests` 直接获取
- 三大数据库覆盖了**序列 → 功能 → 结构**的完整生物信息链条

---

#### 7. 课后练习

1. 安装 Biopython、requests、pandas。

2. 在 Python 中设置 `Entrez.email` 为你的邮箱。

3. 用 `Entrez.einfo(db="nucleotide")` 查看核苷酸数据库的可用字段。

4. 查询 NCBI 有多少条人类胰岛素基因的记录（用 `esearch` + `Count` 字段）。


### 第二课：NCBI 数据库实战 —— 搜索、下载序列、解析 GenBank

本课目标：

- 掌握 Entrez.esearch 搜索数据库并获取 ID 列表

- 掌握 Entrez.efetch 下载 FASTA 和 GenBank 格式

- 解析 GenBank 文件提取序列、注释、CDS 特征

- 批量处理多个 ID

- 掌握历史服务器（history）处理大型查询

- 学会在 AidLux 上运行这些代码

---

#### 1. 搜索数据库（Esearch）

Esearch 返回符合条件的 ID 列表和总数。

**搜索核苷酸数据库（关键字搜索）**：

```python
from Bio import Entrez

Entrez.email = "your_email@example.com"

# 搜索人类胰岛素基因（在 nucleotide 数据库中）
handle = Entrez.esearch(
    db="nucleotide",
    term="human insulin[ORGANISM] AND insulin[GENE]",
    retmax=10  # 最多返回 10 个 ID
)
result = Entrez.read(handle)
handle.close()

print(f"总记录数: {result['Count']}")
print(f"ID 列表: {result['IdList']}")
```

**常见搜索字段**：

| 字段 | 说明 | 示例 |
|------|------|------|
| `[ORGANISM]` | 物种名称 | `human[ORGANISM]` |
| `[GENE]` | 基因名称 | `BRCA1[GENE]` |
| `[PROTEIN]` | 蛋白质名称 | `p53[PROTEIN]` |
| `[TITLE]` | 标题中包含 | `"complete genome"[TITLE]` |
| `[AUTHOR]` | 作者 | `Smith[AUTHOR]` |
| `[PDAT]` | 出版日期 | `2025[PDAT]` |

**逻辑运算符**：

| 运算符 | 说明 | 示例 |
|--------|------|------|
| `AND` | 同时满足 | `human AND insulin` |
| `OR` | 满足之一 | `insulin OR glucagon` |
| `NOT` | 排除 | `insulin NOT rat` |

**搜索蛋白质数据库**：

```python
handle = Entrez.esearch(
    db="protein",
    term="BRCA1[GENE] AND human[ORGANISM]",
    retmax=10
)
result = Entrez.read(handle)
print(result['IdList'])
```

**搜索 Gene 数据库（获取基因信息）**：

```python
handle = Entrez.esearch(
    db="gene",
    term="BRCA1[GENE] AND Homo sapiens[ORGANISM]"
)
result = Entrez.read(handle)
print(result['IdList'])
```

**搜索 PubMed 文献**：

```python
handle = Entrez.esearch(
    db="pubmed",
    term="CRISPR-Cas9[TI] AND 2024[PDAT]"
)
result = Entrez.read(handle)
print(f"找到 {result['Count']} 篇文献")
```

---

#### 2. 下载 FASTA 序列（Efetch）

```python
# 从 nucleotide 数据库下载 FASTA
handle = Entrez.efetch(
    db="nucleotide",
    id="NM_000207",  # 人类胰岛素 mRNA
    rettype="fasta",
    retmode="text"
)
fasta_data = handle.read()
handle.close()
print(fasta_data)
```

**保存到文件**：

```python
with open("insulin.fasta", "w") as f:
    f.write(fasta_data)
```

**从蛋白质数据库下载**：

```python
handle = Entrez.efetch(
    db="protein",
    id="P01308",  # 人胰岛素蛋白
    rettype="fasta",
    retmode="text"
)
protein_fasta = handle.read()
handle.close()
```

**从 Gene 数据库下载（获取基因摘要）**：

```python
handle = Entrez.efetch(
    db="gene",
    id="672",  # BRCA1 的 Gene ID
    rettype="gb",  # GenBank 格式
    retmode="text"
)
gene_data = handle.read()
handle.close()
```

---

#### 3. 下载 GenBank 完整记录

```python
# 下载 GenBank 格式（完整注释 + 序列）
handle = Entrez.efetch(
    db="nucleotide",
    id="NM_000207",
    rettype="gb",  # GenBank
    retmode="text"
)
gb_data = handle.read()
handle.close()

with open("insulin.gb", "w") as f:
    f.write(gb_data)
```

**Efetch 参数速查表**：

| 参数 | 说明 | 常用值 |
|------|------|--------|
| `db` | 数据库 | `nucleotide`, `protein`, `gene`, `pubmed` |
| `id` | 单个 ID 或逗号分隔的 ID 列表 | `"NM_000207"` 或 `"ID1,ID2,ID3"` |
| `rettype` | 返回类型 | `fasta`, `gb`（GenBank）, `gpc`（GPC）, `xml` |
| `retmode` | 返回模式 | `text`（文本）, `xml`（XML） |

---

#### 4. 解析 GenBank 文件（SeqIO）

```python
from Bio import SeqIO

# 读取 GenBank 文件
record = SeqIO.read("insulin.gb", "genbank")

# 基本信息
print("ID:", record.id)
print("描述:", record.description)
print("序列长度:", len(record.seq))
print("序列类型:", record.annotations.get("molecule_type", "N/A"))

# 来源信息
print("物种:", record.annotations.get("organism", "N/A"))

# 所有注释
print("注释键:", record.annotations.keys())
```

**提取特征（CDS、mRNA 等）**：

```python
for feature in record.features:
    if feature.type == "CDS":
        print("--- CDS 特征 ---")
        print("位置:", feature.location)
        # 提取翻译产物
        translation = feature.qualifiers.get("translation", ["N/A"])[0]
        print("翻译序列:", translation[:50] + "...")
        # 提取蛋白 ID
        protein_id = feature.qualifiers.get("protein_id", ["N/A"])[0]
        print("蛋白 ID:", protein_id)
        # 提取基因名
        gene = feature.qualifiers.get("gene", ["N/A"])[0]
        print("基因名:", gene)
```

**提取所有 CDS 的翻译产物**：

```python
cds_sequences = []
for feature in record.features:
    if feature.type == "CDS":
        if "translation" in feature.qualifiers:
            cds_sequences.append(feature.qualifiers["translation"][0])
        elif "protein_id" in feature.qualifiers:
            # 如果有蛋白 ID，但无 translation，可以进一步下载
            print(f"CDS 有蛋白 ID: {feature.qualifiers['protein_id'][0]}")

for i, seq in enumerate(cds_sequences[:5]):  # 只显示前5个
    print(f"CDS {i+1}: {seq[:60]}...")
```

**从 GenBank 提取所有外显子位置**：

```python
exons = []
for feature in record.features:
    if feature.type == "exon":
        start = int(feature.location.start) + 1  # 转为 1-based
        end = int(feature.location.end)
        exons.append((start, end))
print("外显子位置:", exons)
```

---

#### 5. 批量处理多个 ID（一次性获取多条）

```python
# 先搜索获取一批 ID
handle = Entrez.esearch(
    db="nucleotide",
    term="BRCA1[GENE] AND human[ORGANISM]",
    retmax=5
)
result = Entrez.read(handle)
id_list = result['IdList']
print("获取到 ID:", id_list)

# 批量下载 FASTA（用逗号连接）
id_str = ",".join(id_list)
handle = Entrez.efetch(
    db="nucleotide",
    id=id_str,
    rettype="fasta",
    retmode="text"
)
fasta_data = handle.read()
handle.close()

with open("brca1_batch.fasta", "w") as f:
    f.write(fasta_data)
```

**遍历多条 GenBank 记录**：

```python
handle = Entrez.efetch(
    db="nucleotide",
    id=id_str,
    rettype="gb",
    retmode="text"
)

for record in SeqIO.parse(handle, "genbank"):
    print(f"ID: {record.id}")
    print(f"长度: {len(record.seq)}")
    # 提取 CDS 数量
    cds_count = sum(1 for f in record.features if f.type == "CDS")
    print(f"CDS 数量: {cds_count}")
    print("---")

handle.close()
```

---

#### 6. 使用历史服务器（处理大型查询）

当结果数量很大时，用历史服务器（WebEnv + query_key）避免重复搜索：

```python
# 第一次搜索：获取历史 key
search_handle = Entrez.esearch(
    db="nucleotide",
    term="human[ORGANISM] AND mitochondrion[GENE]",
    usehistory="y"  # 关键参数
)
search_result = Entrez.read(search_handle)
search_handle.close()

webenv = search_result["WebEnv"]
query_key = search_result["QueryKey"]
count = int(search_result["Count"])
print(f"总共 {count} 条记录")

# 分批获取（每次 100 条）
batch_size = 100
for start in range(0, min(count, 500), batch_size):
    fetch_handle = Entrez.efetch(
        db="nucleotide",
        retstart=start,
        retmax=batch_size,
        webenv=webenv,
        query_key=query_key,
        rettype="fasta",
        retmode="text"
    )
    data = fetch_handle.read()
    fetch_handle.close()
    print(f"已获取 {start+1} 到 {min(start+batch_size, count)}")
    # 保存到文件
    with open(f"batch_{start//batch_size}.fasta", "w") as f:
        f.write(data)
```

---

#### 7. 实战：搜索 BRCA1 基因的所有 mRNA 转录本

```python
from Bio import Entrez, SeqIO

Entrez.email = "your_email@example.com"

# 搜索 BRCA1 mRNA（refseq 数据库）
handle = Entrez.esearch(
    db="nucleotide",
    term="BRCA1[GENE] AND human[ORGANISM] AND mRNA[FILTER] AND srcdb_refseq[PROP]",
    retmax=20
)
result = Entrez.read(handle)
ids = result['IdList']

print(f"找到 {len(ids)} 个 BRCA1 mRNA 转录本")

# 下载每个转录本的 GenBank，提取外显子和 CDS
for acc in ids[:5]:  # 只处理前5个
    handle = Entrez.efetch(db="nucleotide", id=acc, rettype="gb", retmode="text")
    record = SeqIO.read(handle, "genbank")
    handle.close()

    print(f"\n=== {acc} ===")
    print(f"长度: {len(record.seq)}")
    print(f"描述: {record.description}")

    # 统计外显子数量
    exons = [f for f in record.features if f.type == "exon"]
    print(f"外显子数量: {len(exons)}")

    # 找 CDS
    cds_features = [f for f in record.features if f.type == "CDS"]
    for cds in cds_features:
        if "translation" in cds.qualifiers:
            prot = cds.qualifiers["translation"][0]
            print(f"蛋白长度: {len(prot)} aa")
            break
```

---

#### 8. Esearch 字段汇总

| 数据库 | 常用字段 | 示例 |
|--------|----------|------|
| `nucleotide` | `[GENE]`, `[ORGANISM]`, `[PROP]`, `[FILTER]` | `BRCA1[GENE] AND human[ORGANISM]` |
| `protein` | `[GENE]`, `[ORGANISM]`, `[MOLWT]` | `p53[GENE] AND human[ORGANISM]` |
| `pubmed` | `[TI]`（标题）, `[AU]`（作者）, `[DP]`（日期） | `CRISPR[TI] AND 2024[DP]` |
| `gene` | `[GENE]`, `[ORGANISM]`, `[CHR]`（染色体） | `BRCA1[GENE] AND human[ORGANISM]` |

**NCBI 特殊属性 `[PROP]`**：

| 属性 | 含义 |
|------|------|
| `refseq[PROP]` | RefSeq 数据库记录 |
| `genomic[PROP]` | 基因组序列 |
| `mrna[PROP]` | mRNA 序列 |
| `cds[PROP]` | CDS 序列 |
| `srcdb_refseq[PROP]` | 来源于 RefSeq |

---

#### 9. 常见错误与解决

| 错误 | 原因 | 解决 |
|------|------|------|
| `Entrez.efetch` 返回空 | ID 不正确或数据库不匹配 | 检查 ID 是否属于该数据库 |
| `HTTP Error 429: Too Many Requests` | 请求过于频繁 | 减小请求频率，添加 `sleep(0.3)` |
| `ValueError: Failed to parse XML` | 返回内容不是 XML | 检查 `retmode` 参数是否正确 |
| 解析 GenBank 时 `SeqRecord` 无特征 | 下载的是 FASTA 而非 GenBank | 修改 `rettype="gb"` |
| `Entrez.email not set` | 未设置邮箱 | 在调用前设置 `Entrez.email` |
| 搜索返回 0 条记录 | 搜索词有误 | 在 NCBI 官网先用相同关键词验证 |

---

#### 10. 本课核心代码模板

```python
from Bio import Entrez, SeqIO

Entrez.email = "your_email@example.com"

def search_and_fetch(db, term, retmax=10, rettype="fasta"):
    """搜索并下载序列"""
    # 搜索
    search = Entrez.esearch(db=db, term=term, retmax=retmax)
    result = Entrez.read(search)
    ids = result['IdList']
    if not ids:
        print("没有找到记录")
        return None

    # 批量获取
    id_str = ",".join(ids)
    fetch = Entrez.efetch(db=db, id=id_str, rettype=rettype, retmode="text")
    data = fetch.read()
    fetch.close()
    return data

# 使用示例
fasta = search_and_fetch("nucleotide", "BRCA1[GENE] AND human[ORGANISM]", retmax=5)
with open("brca1.fasta", "w") as f:
    f.write(fasta)
```

---

#### 11. 课后练习

1. 用 Esearch 搜索人类 TP53 基因的核苷酸序列，获取 ID 列表并打印总数。

2. 从蛋白质数据库下载 TP53 蛋白序列（ID: P04637）的 FASTA。

3. 用 GenBank 格式下载人类 BRCA1 基因（NM_007294），解析并打印其所有外显子的起始和结束位置。

4. 写一个函数 `fetch_gene_sequence(gene_name, organism="human")`，返回该基因的第一个 mRNA 序列的 FASTA 字符串。

 搜索最近 1 年发表的关于 CRISPR-Cas9 的 PubMed 文献，打印前 5 篇的标题。


### 第三课：UniProt 数据库实战 —— 蛋白质功能注释与批量查询

本课目标：

- 理解 UniProt 的构成（Swiss-Prot 与 TrEMBL 的区别）

- 掌握 UniProt REST API 的查询语法和端点

- 按基因名和物种搜索蛋白质

- 解析 UniProt JSON 响应，提取核心注释（功能、GO 术语、结构域）

- 根据 NCBI 蛋白质 ID 映射到 UniProt ID

- 批量查询多个蛋白质并导出为结构化数据

---

#### 1. UniProt 简介（Swiss-Prot vs TrEMBL）

| 数据库 | 说明 | 特点 |
|--------|------|------|
| **Swiss-Prot** | 人工注释（Manual curation） | 高质量、高可靠性，有详细功能注释和文献引用 |
| **TrEMBL** | 自动注释（Automatic annotation） | 基于核酸序列翻译，未经人工复核，注释较粗 |

两者统称为 UniProtKB（UniProt Knowledgebase）。搜索时默认包含两者，但可通过过滤区分。

**UniProt 记录的核心内容**：

| 字段 | 说明 |
|------|------|
| Accession（登录号） | 主标识符（如 P01308） |
| Entry Name（条目名） | 可读标识符（如 INS_HUMAN） |
| Protein Name | 蛋白质全名 |
| Gene Name | 基因名称 |
| Organism | 物种 |
| Function（功能） | 蛋白质的生物学功能描述 |
| Subcellular Location | 亚细胞定位 |
| Domains & Sites | 结构域、活性位点、跨膜区 |
| GO Terms | 基因本体注释（分子功能、生物过程、细胞组分） |
| Cross-references | 到其他数据库的链接（NCBI、PDB、Pfam 等） |
| Sequence | 氨基酸序列 |

---

#### 2. UniProt REST API 基础

**API 基础信息**：

| 项目 | 值 |
|------|-----|
| 基础 URL | `https://rest.uniprot.org` |
| 搜索端点 | `/uniprotkb/search` |
| 获取记录 | `/uniprotkb/{accession}` |
| 获取序列 | `/uniprotkb/{accession}/fasta` |
| 获取批量 | `/uniprotkb/stream` |
| 返回格式 | JSON（默认）或 TSV / XML |

**频率限制**：

- 无 API Key：每分钟 60 次请求（每秒 1 次）
- 建议添加 `sleep(1)` 或使用 `time.sleep(0.5)` 保守请求

**基础导入**：

```python
import requests
import time
import json
```

---

#### 3. 按基因名/物种搜索蛋白质（Search）

**搜索人类 BRCA1 基因的蛋白质记录**：

```python
import requests

def search_uniprot(query, format="json"):
    """搜索 UniProt，返回 JSON 结果"""
    url = "https://rest.uniprot.org/uniprotkb/search"
    params = {
        "query": query,
        "format": format
    }
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

# 搜索人类 BRCA1
result = search_uniprot("gene:BRCA1 AND organism_id:9606")
print(f"总记录数: {result['results'][0]['total'] if 'total' in result else len(result['results'])}")

for entry in result['results']:
    print("Accession:", entry['primaryAccession'])
    print("Entry Name:", entry.get('uniProtkbId', 'N/A'))
    print("Gene:", entry['genes'][0]['geneName']['value'] if entry.get('genes') else 'N/A')
    print("Protein:", entry['proteinDescription']['recommendedName']['fullName']['value'])
    print("---")
```

**搜索人类胰岛素蛋白（INS）**：

```python
result = search_uniprot("gene:INS AND organism_id:9606")
if result['results']:
    entry = result['results'][0]
    print(f"登录号: {entry['primaryAccession']}")
    print(f"蛋白名: {entry['proteinDescription']['recommendedName']['fullName']['value']}")
```

**常用查询字段**：

| 字段 | 用途 | 示例 |
|------|------|------|
| `gene` | 基因名 | `gene:BRCA1` |
| `organism_id` | NCBI 物种 ID（人类=9606） | `organism_id:9606` |
| `organism_name` | 物种名 | `organism_name:"Homo sapiens"` |
| `accession` | 登录号 | `accession:P01308` |
| `reviewed` | 是否 Swiss-Prot（true=瑞士） | `reviewed:true` |
| `go` | GO 术语 ID | `go:GO:0005515` |
| `domain` | 结构域 | `domain:"Protein kinase"` |
| `existence` | 存在性（实验证据等） | `existence:1` |

**逻辑组合**：和 NCBI 一样，支持 `AND`、`OR`、`NOT` 和括号。

---

#### 4. 解析 UniProt JSON 结果（核心字段）

UniProt JSON 结构较深，以下是安全提取常见字段的方法：

```python
def safe_get(obj, path, default="N/A"):
    """安全提取嵌套字段"""
    for key in path.split('.'):
        if isinstance(obj, dict):
            obj = obj.get(key, {})
        elif isinstance(obj, list):
            if key.isdigit():
                obj = obj[int(key)] if int(key) < len(obj) else {}
            else:
                # 尝试找第一个匹配的字段
                for item in obj:
                    if isinstance(item, dict) and key in item:
                        obj = item[key]
                        break
                else:
                    return default
        else:
            return default
    return obj if obj else default

def parse_uniprot_entry(entry):
    """提取核心信息"""
    acc = entry['primaryAccession']
    entry_name = entry.get('uniProtkbId', 'N/A')
    
    # 蛋白名
    protein = entry.get('proteinDescription', {})
    name = protein.get('recommendedName', {})
    if not name:
        name = protein.get('submissionNames', [{}])[0]
    protein_name = name.get('fullName', {}).get('value', 'N/A')
    
    # 基因名
    genes = entry.get('genes', [])
    gene_name = genes[0]['geneName']['value'] if genes else 'N/A'
    
    # 物种
    organism = entry.get('organism', {}).get('scientificName', 'N/A')
    organism_id = entry.get('organism', {}).get('taxonId', 'N/A')
    
    # 长度
    length = entry.get('sequence', {}).get('length', 'N/A')
    
    # 是否已审阅（Swiss-Prot）
    reviewed = entry.get('entryType', 'Unreviewed') == 'Swiss-Prot'
    
    return {
        'accession': acc,
        'entry_name': entry_name,
        'protein_name': protein_name,
        'gene_name': gene_name,
        'organism': organism,
        'taxon_id': organism_id,
        'length': length,
        'reviewed': reviewed
    }

# 示例
result = search_uniprot("gene:TP53 AND organism_id:9606 AND reviewed:true")
if result['results']:
    info = parse_uniprot_entry(result['results'][0])
    print(info)
```

---

#### 5. 根据 UniProt ID 获取详细注释

```python
def get_uniprot_entry(accession, format="json"):
    """根据登录号获取完整记录"""
    url = f"https://rest.uniprot.org/uniprotkb/{accession}"
    params = {"format": format}
    resp = requests.get(url, params=params)
    resp.raise_for_status()
    return resp.json()

# 获取人类胰岛素（P01308）的详细注释
entry = get_uniprot_entry("P01308")
```

**提取功能描述（Function）**：

```python
def get_function(entry):
    """提取蛋白质功能描述"""
    comments = entry.get('comments', [])
    for comment in comments:
        if comment.get('commentType') == 'FUNCTION':
            texts = comment.get('texts', [])
            return texts[0]['value'] if texts else 'N/A'
    return 'N/A'

print("功能:", get_function(entry))
```

**提取亚细胞定位（Subcellular Location）**：

```python
def get_subcellular(entry):
    """提取亚细胞定位"""
    comments = entry.get('comments', [])
    for comment in comments:
        if comment.get('commentType') == 'SUBCELLULAR_LOCATION':
            locations = comment.get('locations', [])
            return ', '.join([loc['value'] for loc in locations]) if locations else 'N/A'
    return 'N/A'

print("亚细胞定位:", get_subcellular(entry))
```

**提取结构域（Domains）**：

```python
def get_domains(entry):
    """提取结构域"""
    domains = []
    comments = entry.get('comments', [])
    for comment in comments:
        if comment.get('commentType') == 'DOMAIN':
            desc = comment.get('texts', [{}])[0].get('value', 'N/A')
            # 位置信息
            pos = comment.get('positions', [{}])[0]
            start = pos.get('start', {}).get('value', '?')
            end = pos.get('end', {}).get('value', '?')
            domains.append(f"{desc} ({start}-{end})")
    return domains if domains else ['N/A']

print("结构域:", get_domains(entry))
```

---

#### 6. 提取 GO 注释（Gene Ontology）

```python
def get_go_terms(entry):
    """提取 GO 术语及相关信息"""
    go_terms = []
    db_refs = entry.get('uniProtKBCrossReferences', [])
    for ref in db_refs:
        if ref.get('database') == 'GO':
            go_id = ref.get('id')
            # GO 类型：C=细胞组分，F=分子功能，P=生物过程
            properties = ref.get('properties', [])
            go_type = ''
            go_term = ''
            for prop in properties:
                if prop.get('key') == 'GO':
                    go_term = prop.get('value')
                if prop.get('key') == 'GO-Term'):
                    go_type = prop.get('value')
            evidence = ref.get('evidenceTypes', [{}])[0].get('code', 'N/A')
            go_terms.append({
                'id': go_id,
                'term': go_term,
                'type': go_type,
                'evidence': evidence
            })
    return go_terms

# 示例
entry = get_uniprot_entry("P01308")
gos = get_go_terms(entry)
for go in gos[:5]:
    print(f"{go['id']} ({go['type']}): {go['term']}")
```

**精简版：只提取 GO ID 列表**：

```python
def get_go_ids(entry):
    go_ids = []
    for ref in entry.get('uniProtKBCrossReferences', []):
        if ref.get('database') == 'GO':
            go_ids.append(ref.get('id'))
    return go_ids
```

---

#### 7. 映射 NCBI 蛋白质 ID 到 UniProt ID（跨库连接）

有时你只有 NCBI 的 RefSeq 蛋白 ID（如 NP_000198），需要找到对应的 UniProt ID。

```python
def ncbi_to_uniprot(ncbi_protein_id):
    """根据 NCBI 蛋白 ID 查找 UniProt 登录号"""
    url = "https://rest.uniprot.org/uniprotkb/search"
    query = f"xref:NCBI_{ncbi_protein_id}"
    params = {"query": query, "format": "json"}
    resp = requests.get(url, params=params)
    resp.raise_for_status()
    result = resp.json()
    if result.get('results'):
        return result['results'][0]['primaryAccession']
    return None

# 示例：NCBI 蛋白 ID → UniProt
uniprot_acc = ncbi_to_uniprot("NP_000198")  # 人胰岛素前体
print("对应 UniProt 登录号:", uniprot_acc)
```

**其他常用映射前缀**：

| 数据库 | 前缀 | 示例 |
|--------|------|------|
| NCBI RefSeq 蛋白 | `NCBI_NP_` | `NCBI_NP_000198` |
| NCBI Gene ID | `NCBI_Gene_` | `NCBI_Gene_672` |
| Ensembl | `Ensembl_` | `Ensembl_ENSP00000265050` |
| Pfam | `Pfam_` | `Pfam_PF00069` |
| InterPro | `InterPro_` | `InterPro_IPR001245` |

---

#### 8. 批量查询多个蛋白质（Stream 端点）

使用 `/uniprotkb/stream` 可以批量获取多条记录（最多 500 条）。

```python
def batch_fetch_uniprot(accessions):
    """批量获取多个 UniProt 记录的 JSON"""
    if isinstance(accessions, list):
        accessions = " OR ".join([f"accession:{a}" for a in accessions])
    url = "https://rest.uniprot.org/uniprotkb/stream"
    params = {
        "query": accessions,
        "format": "json"
    }
    resp = requests.get(url, params=params)
    resp.raise_for_status()
    return resp.json()  # 返回的是 results 列表

# 查询多个蛋白质
ids = ["P01308", "P04637", "P38398"]  # 胰岛素、TP53、BRCA1
data = batch_fetch_uniprot(ids)

for entry in data.get('results', []):
    info = parse_uniprot_entry(entry)
    print(f"{info['accession']} | {info['gene_name']} | {info['protein_name']} | {info['length']} aa")
```

---

#### 9. 下载蛋白质 FASTA 序列

**方式一：通过 API 单条获取**：

```python
def fetch_uniprot_fasta(accession):
    url = f"https://rest.uniprot.org/uniprotkb/{accession}/fasta"
    resp = requests.get(url)
    resp.raise_for_status()
    return resp.text

# 下载 P01308 的 FASTA
fasta = fetch_uniprot_fasta("P01308")
print(fasta[:200])  # 查看前 200 字符
```

**方式二：从 JSON 结果中提取序列**：

```python
def get_sequence_from_json(entry):
    return entry.get('sequence', {}).get('value', '')

# 使用已有的 entry
seq = get_sequence_from_json(entry)
print("序列长度:", len(seq))
```

**批量下载多个 FASTA（用 stream）**：

```python
def batch_fetch_fasta(accessions):
    if isinstance(accessions, list):
        accessions = " OR ".join([f"accession:{a}" for a in accessions])
    url = "https://rest.uniprot.org/uniprotkb/stream"
    params = {"query": accessions, "format": "fasta"}
    resp = requests.get(url, params=params)
    resp.raise_for_status()
    return resp.text

fasta_data = batch_fetch_fasta(["P01308", "P04637"])
with open("batch_uniprot.fasta", "w") as f:
    f.write(fasta_data)
```

---

#### 10. 从 UniProt 获取跨数据库引用（如 PDB 结构）

```python
def get_pdb_refs(entry):
    """获取关联的 PDB 结构 ID"""
    pdb_ids = []
    for ref in entry.get('uniProtKBCrossReferences', []):
        if ref.get('database') == 'PDB':
            pdb_ids.append(ref.get('id'))
    return pdb_ids

entry = get_uniprot_entry("P01308")
pdb_refs = get_pdb_refs(entry)
print("PDB 结构 ID:", pdb_refs)
```

---

#### 11. 完整实战：从基因名到蛋白质功能全流程

```python
import requests
import time

def gene_to_protein_annotation(gene_name, organism="9606"):
    """根据基因名获取蛋白质完整注释"""
    query = f"gene:{gene_name} AND organism_id:{organism}"
    url = "https://rest.uniprot.org/uniprotkb/search"
    params = {"query": query, "format": "json"}
    resp = requests.get(url, params=params)
    resp.raise_for_status()
    results = resp.json().get('results', [])
    if not results:
        return None
    entry = results[0]
    
    return {
        'accession': entry['primaryAccession'],
        'protein_name': entry.get('proteinDescription', {}).get('recommendedName', {}).get('fullName', {}).get('value', 'N/A'),
        'gene': gene_name,
        'function': get_function(entry),
        'subcellular': get_subcellular(entry),
        'domains': get_domains(entry),
        'go_ids': get_go_ids(entry),
        'sequence': entry.get('sequence', {}).get('value', '')
    }

# 实战：获取 TP53 的完整注释
tp53_info = gene_to_protein_annotation("TP53")
if tp53_info:
    print("登录号:", tp53_info['accession'])
    print("蛋白名:", tp53_info['protein_name'])
    print("功能:", tp53_info['function'][:150] + "...")
    print("亚细胞定位:", tp53_info['subcellular'])
    print("GO ID:", tp53_info['go_ids'][:5])
    print("序列长度:", len(tp53_info['sequence']))
```

---

#### 12. 常见错误与解决

| 错误 | 原因 | 解决 |
|------|------|------|
| `404 Not Found` | 访问号不存在 | 检查访问号拼写，确认是 UniProt 格式（如 P01308） |
| JSON 解析失败（`KeyError`） | 某些字段缺失 | 使用 `.get()` 安全取值，不要硬索引 |
| 搜索结果为空（`results` = []） | 查询条件太严格或基因名拼写错误 | 在 UniProt 官网用相同关键词测试 |
| `Rate limit exceeded` | 请求频率过高 | 增加 `time.sleep(1)` |
| 批量查询超过 500 条 | 单次 stream 限制 | 分批次查询，每批 ≤ 500 个 |
| 网络超时 | 网络环境不佳 | 设置 `timeout=30` 参数 |

---

#### 13. 本课核心代码模板速查

| 操作 | 代码模板 |
|------|----------|
| 搜索蛋白 | `requests.get("https://rest.uniprot.org/uniprotkb/search", params={"query":"gene:BRCA1 AND organism_id:9606"})` |
| 获取单个记录 | `requests.get("https://rest.uniprot.org/uniprotkb/P01308")` |
| 获取 FASTA | `requests.get("https://rest.uniprot.org/uniprotkb/P01308/fasta")` |
| 批量获取 | `requests.get("https://rest.uniprot.org/uniprotkb/stream", params={"query":"accession:P01308 OR accession:P04637", "format":"json"})` |
| NCBI → UniProt | 搜索 `xref:NCBI_NP_000198` |

---

#### 14. 本课小结

- **UniProt** 是蛋白质功能注释的首选数据库，Swiss-Prot 为人工审阅，质量最高
- **REST API** 端点：`/uniprotkb/search`（搜索）、`/uniprotkb/{id}`（单条）、`/uniprotkb/stream`（批量）
- **核心注释字段**：功能（`FUNCTION`）、亚细胞定位（`SUBCELLULAR_LOCATION`）、结构域（`DOMAIN`）、GO 术语
- **跨库链接**：通过 `uniProtKBCrossReferences` 获取 NCBI、PDB、Pfam 等外部 ID
- **批量操作**使用 `stream` 端点，支持 FASTA 和 JSON 格式

---

#### 15. 课后练习

1. 用 UniProt API 搜索人类 EGFR 基因（基因名 EGFR），打印其 Swiss-Prot 登录号。

2. 下载 P04637（人 TP53）的 FASTA 序列并保存到本地文件。

3. 从 P01308 记录中提取功能描述和亚细胞定位。

4. 用 `ncbi_to_uniprot()` 函数将 NCBI RefSeq ID `NP_001296233`（人 HER2 蛋白）映射为 UniProt ID。

5. 批量查询 3 个蛋白质（P01308、P04637、P38398），生成一个 CSV，包含：登录号、基因名、蛋白名、长度。

### 第四课：PDB 数据库 —— 三维结构下载与基础解析

本课目标：

- 理解 PDB（蛋白质数据银行）的核心数据内容

- 区分 mmCIF（.cif）与 PDB（.pdb）文件格式

- 使用 Biopython 的 `PDBList` 批量下载结构文件

- 使用 `MMCIFParser` / `PDBParser` 解析三维结构

- 遍历结构层次（Model → Chain → Residue → Atom）

- 提取蛋白序列、配体信息、分辨率等元数据

- 用 RCSB PDB REST API 搜索和获取结构信息

---

#### 1. PDB 文件格式与获取方式

**PDB 核心文件格式对比**：

| 格式 | 扩展名 | 特点 | 推荐程度 |
|------|--------|------|----------|
| mmCIF（宏观分子晶体学信息文件） | `.cif` | 现代标准，信息更完整，支持大分子复合物 | 强烈推荐 |
| PDB（旧格式） | `.pdb` | 固定列宽，行数限制，逐步淘汰 | 旧代码兼容 |
| XML | `.xml` | 便于解析，但文件较大 | 一般 |

**获取 PDB 结构的主要途径**：

| 途径 | 方式 | 适用场景 |
|------|------|----------|
| Biopython PDBList | 直接下载文件 | 批量下载，离线分析 |
| RCSB REST API | HTTP 请求获取 JSON 元数据 | 快速查询结构信息 |
| 官网 FTP | 手动或 wget 下载 | 一次性全库同步 |

---

#### 2. 安装与导入

```python
import requests
from Bio import PDB
from Bio.PDB import PDBList, MMCIFParser, PDBParser, PPBuilder
from Bio.PDB.Polypeptide import three_to_one, is_aa
```

**注意**：`Bio.PDB` 是 Biopython 的一部分，已随 `biopython` 安装。

---

#### 3. 用 PDBList 下载结构文件

**下载单个 PDB 文件（旧格式）**：

```python
pdb_list = PDBList()
pdb_list.retrieve_pdb_file('1TUP', pdir='./pdb_files', file_format='pdb')
# 下载后文件为 ./pdb_files/pdb1tup.ent（旧命名）
```

**下载 mmCIF 格式（推荐）**：

```python
pdb_list.retrieve_pdb_file('1TUP', pdir='./cif_files', file_format='mmCif')
# 文件为 ./cif_files/1tup.cif
```

**批量下载**：

```python
pdb_ids = ['1TUP', '2DNS', '3B43']
for pid in pdb_ids:
    pdb_list.retrieve_pdb_file(pid, pdir='./cif_files', file_format='mmCif')
    print(f"已下载: {pid}")
```

**文件命名说明**：

| 格式 | 参数 file_format | 文件名示例 |
|------|------------------|------------|
| PDB | `'pdb'` | `pdb1tup.ent` |
| mmCIF | `'mmCif'` | `1tup.cif` |
| PDB 压缩 | `'pdb'` + 手动解压 | 可配合 `tar` |

---

#### 4. 解析 mmCIF 文件（推荐方式）

```python
parser = MMCIFParser(QUIET=True)
structure = parser.get_structure('1TUP', './cif_files/1tup.cif')
```

**解析旧 PDB 文件**：

```python
parser = PDBParser(QUIET=True)
structure = parser.get_structure('1TUP', './pdb_files/pdb1tup.ent')
```

**参数说明**：
- `QUIET=True`：不显示解析过程中的警告信息
- 第一个参数是结构 ID（可任意命名）

---

#### 5. 遍历结构层次（核心操作）

PDB 结构的层次：`Structure → Model(s) → Chain(s) → Residue(s) → Atom(s)`

**遍历所有链和残基**：

```python
for model in structure:
    print(f"Model: {model.id}")
    for chain in model:
        print(f"  Chain: {chain.id}")
        residues = list(chain.get_residues())
        print(f"    残基数量: {len(residues)}")
        # 只打印前 5 个残基
        for i, residue in enumerate(residues[:5]):
            res_name = residue.get_resname()
            res_id = residue.get_id()[1]  # 残基编号（坐标）
            print(f"      {i+1}: {res_name} {res_id}")
        if len(residues) > 5:
            print(f"      ... (还有 {len(residues) - 5} 个残基)")
```

**获取所有原子坐标（以 CA 原子为例）**：

```python
ca_atoms = []
for model in structure:
    for chain in model:
        for residue in chain:
            if is_aa(residue):  # 只处理标准氨基酸
                if 'CA' in residue:
                    ca = residue['CA']
                    ca_atoms.append((residue.get_resname(), ca.get_coord()))
                    print(f"{residue.get_resname()} CA: {ca.get_coord()}")

print(f"共找到 {len(ca_atoms)} 个 CA 原子")
```

---

#### 6. 提取蛋白序列（FASTA）

使用 `PPBuilder` 从结构中提取肽链序列：

```python
ppb = PPBuilder()
sequences = ppb.build_peptides(structure)

for i, peptide in enumerate(sequences):
    seq_str = str(peptide.get_sequence())
    print(f"链 {i+1}: {seq_str[:30]}... (长度: {len(seq_str)})")
```

**获取每条链的序列（更精细控制）**：

```python
from Bio.PDB.Polypeptide import three_to_one

def get_chain_sequence(chain):
    seq = []
    for residue in chain:
        if is_aa(residue):
            res_name = residue.get_resname()
            # 三字母转单字母
            if res_name in three_to_one:
                seq.append(three_to_one[res_name])
            else:
                seq.append('X')
    return ''.join(seq)

for model in structure:
    for chain in model:
        seq = get_chain_sequence(chain)
        print(f"链 {chain.id}: 长度 {len(seq)}")
        print(seq[:60] + "..." if len(seq) > 60 else seq)
```

---

#### 7. 提取非蛋白组分（配体、水分子、离子）

```python
def get_non_standard_residues(structure):
    het_dict = {}
    for model in structure:
        for chain in model:
            for residue in chain:
                if not is_aa(residue):
                    res_name = residue.get_resname()
                    if res_name not in het_dict:
                        het_dict[res_name] = 0
                    het_dict[res_name] += 1
    return het_dict

het_stats = get_non_standard_residues(structure)
print("非标准残基统计:")
for name, count in sorted(het_stats.items(), key=lambda x: -x[1]):
    print(f"  {name}: {count} 个")
```

**过滤特定配体（如 HEM、ATP）**：

```python
def find_ligands(structure, ligand_names=['HEM', 'ATP', 'NAD']):
    ligands = []
    for model in structure:
        for chain in model:
            for residue in chain:
                if residue.get_resname() in ligand_names:
                    ligands.append({
                        'chain': chain.id,
                        'residue': residue.get_resname(),
                        'id': residue.get_id()[1],
                        'model': model.id
                    })
    return ligands

print(find_ligands(structure))
```

---

#### 8. 从 RCSB PDB API 获取元数据（无需下载文件）

RCSB 提供 REST API，可直接查询结构的元数据（分辨率、实验方法、释放日期等）。

```python
def get_pdb_metadata(pdb_id):
    url = f"https://data.rcsb.org/rest/v1/core/entry/{pdb_id}"
    response = requests.get(url)
    if response.status_code != 200:
        return None
    data = response.json()
    
    # 提取关键信息
    metadata = {
        'id': data.get('rcsb_id', pdb_id),
        'title': data.get('struct', {}).get('title', 'N/A'),
        'resolution': data.get('rcsb_entry_info', {}).get('resolution_combined', ['N/A'])[0],
        'experiment_method': data.get('exptl', [{}])[0].get('method', 'N/A'),
        'deposit_date': data.get('rcsb_accession_info', {}).get('deposit_date', 'N/A'),
        'release_date': data.get('rcsb_accession_info', {}).get('release_date', 'N/A'),
        'polymer_count': data.get('rcsb_entry_info', {}).get('polymer_entity_count_polymer', 0),
        'deposited_sequence_count': data.get('rcsb_entry_info', {}).get('deposited_polymer_entity_sequence_length', 0)
    }
    return metadata

# 获取 1TUP 的元数据
info = get_pdb_metadata('1TUP')
if info:
    print("PDB ID:", info['id'])
    print("标题:", info['title'][:80] + "...")
    print("分辨率:", info['resolution'], "Å")
    print("实验方法:", info['experiment_method'])
    print("释放日期:", info['release_date'])
```

**搜索 PDB（根据基因名或蛋白名）**：

```python
def search_pdb_by_gene(gene_name):
    url = "https://search.rcsb.org/rcsbsearch/v1/query"
    query = {
        "query": {
            "type": "terminal",
            "service": "text",
            "parameters": {"value": gene_name}
        },
        "return_type": "entry",
        "request_options": {"paginate": {"start": 0, "rows": 10}}
    }
    response = requests.post(url, json=query)
    if response.status_code == 200:
        data = response.json()
        ids = [result['identifier'] for result in data.get('result_set', [])]
        return ids
    return []

# 搜索 BRCA1 相关结构
pdb_ids = search_pdb_by_gene("BRCA1")
print("BRCA1 相关 PDB 结构:", pdb_ids[:10])
```

---

#### 9. 计算结构的基础统计

```python
def calc_structure_stats(structure):
    """计算结构的基本统计信息"""
    stats = {
        'models': 0,
        'chains': 0,
        'residues': 0,
        'atoms': 0,
        'aa_residues': 0,
        'hetero_residues': 0,
        'ca_count': 0
    }
    
    for model in structure:
        stats['models'] += 1
        for chain in model:
            stats['chains'] += 1
            for residue in chain:
                stats['residues'] += 1
                if is_aa(residue):
                    stats['aa_residues'] += 1
                    if 'CA' in residue:
                        stats['ca_count'] += 1
                else:
                    stats['hetero_residues'] += 1
                for atom in residue:
                    stats['atoms'] += 1
    return stats

stats = calc_structure_stats(structure)
print("=== 结构统计 ===")
print(f"模型数: {stats['models']}")
print(f"链数: {stats['chains']}")
print(f"总残基数: {stats['residues']}")
print(f"  氨基酸残基: {stats['aa_residues']}")
print(f"  非标准残基: {stats['hetero_residues']}")
print(f"总原子数: {stats['atoms']}")
print(f"CA 原子数: {stats['ca_count']}")
```

---

#### 10. 处理多模型结构（NMR 结构）

NMR 结构通常包含多个模型（构象），需要遍历所有模型：

```python
for model in structure:
    print(f"=== Model {model.id} ===")
    # 计算该模型的某个属性，如总能量
    for chain in model:
        print(f"  链 {chain.id}: {len(list(chain.get_residues()))} 个残基")
```

---

#### 11. 序列与结构的交叉验证（检查 PDB 序列与 FASTA 是否一致）

```python
from Bio import SeqIO
from Bio.PDB.Polypeptide import three_to_one

def get_pdb_sequence(structure):
    """从 PDB 结构提取完整序列"""
    seq = []
    for model in structure:
        for chain in model:
            chain_seq = get_chain_sequence(chain)
            if chain_seq:
                seq.append(chain_seq)
                break  # 只取第一个模型的第一个链
        break  # 只取第一个模型
    return seq[0] if seq else ""

pdb_seq = get_pdb_sequence(structure)
print(f"PDB 序列长度: {len(pdb_seq)}")
print(f"序列开头: {pdb_seq[:50]}...")
```

---

#### 12. 常见错误与解决

| 错误 | 原因 | 解决 |
|------|------|------|
| `FileNotFoundError` | 下载路径不正确或文件名不一致 | 使用 `os.path.join` 构建路径，检查文件是否已下载 |
| `KeyError` 解析 mmCIF | 某些字段缺失 | 用 `.get()` 安全访问，而非直接索引 |
| `BiopythonWarning: You are using PDBParser` | 旧格式解析警告 | 改用 `MMCIFParser` |
| `is_aa()` 将非标准氨基酸忽略 | 修饰氨基酸（如 MSE）被跳过 | 手动添加非标准氨基酸到识别列表 |
| 三维坐标解包异常 | 某些原子坐标缺失 | 检查 `residue.has_id('CA')` 后再访问 |
| RCSB API 返回 404 | PDB ID 不存在 | 先在官网验证 ID 是否正确 |

---

#### 13. 本课核心代码模板速查

| 操作 | 代码模板 |
|------|----------|
| 下载 mmCIF | `PDBList().retrieve_pdb_file('1TUP', file_format='mmCif')` |
| 解析 mmCIF | `MMCIFParser().get_structure('1TUP', '1tup.cif')` |
| 遍历链 | `for chain in structure[0]`（取第一个模型） |
| 获取残基 | `for residue in chain.get_residues()` |
| 获取原子坐标 | `residue['CA'].get_coord()` |
| 提取序列 | `PPBuilder().build_peptides(structure)[0].get_sequence()` |
| 查询元数据 | `requests.get("https://data.rcsb.org/rest/v1/core/entry/1TUP")` |
| 搜索结构 | `requests.post("https://search.rcsb.org/rcsbsearch/v1/query", json=...)` |

---

#### 14. 课后练习

1. 用 `PDBList` 下载人血红蛋白结构（PDB ID: 2DN2）的 mmCIF 文件。

2. 解析 2DN2，统计其包含的链数、氨基酸残基数和血红蛋白辅基（HEM）数量。

3. 用 `PPBuilder` 提取 2DN2 的 α 链序列（链 A）并打印其长度。

4. 用 RCSB API 获取 2DN2 的分辨率和实验方法。

5. 写一个函数，输入 PDB ID，返回该结构中所有配体的名称列表（去重）。

6. （选做）提取所有 CA 原子坐标，计算该蛋白质的几何中心（所有 CA 坐标的平均值）。


### 第五课：AlphaFold —— 当人工智能遇见蛋白质结构

本课目标：

- 理解 AlphaFold 的生物学背景（Anfinsen 法则与 Levinthal 悖论）

- 掌握 AlphaFold 的 AI 原理（共进化分析 + Evoformer + 结构模块）

- 区分 AlphaFold2、AlphaFold-Multimer、AlphaFold3 的演进

- 通过 AlphaFold Server 在线预测蛋白质结构（无需安装）

- 通过 ColabFold 在浏览器中运行 AlphaFold2（GPU 加速）

- 通过 AlphaFold Database API 批量获取预计算结果

- 将 AlphaFold 预测结果与 PDB、UniProt 数据整合

---

#### 1. 为什么 AlphaFold 是人工智能的里程碑

AlphaFold 是 Google DeepMind 开发的 AI 系统，能从氨基酸序列直接预测蛋白质的三维结构[reference:0][reference:1]。2024 年诺贝尔化学奖授予了 AlphaFold2 的相关工作[reference:2]。截至目前，AlphaFold 已预测了约 2 亿个蛋白质的结构，几乎覆盖科学界已知的所有蛋白质[reference:3]。

**与前文的衔接**：

- 附录 5 讲的深度学习（Transformer、Attention）正是 AlphaFold 的核心技术
- 附录 6 前四课讲的 UniProt（获取序列）和 PDB（实验结构）正是 AlphaFold 的训练数据和验证基准

---

#### 2. 生物学背景：为什么这个问题很难

**Anfinsen 法则**：蛋白质的天然结构仅由其氨基酸序列决定。理论上，给定序列就能算出结构。

**Levinthal 悖论**：一个 100 个氨基酸的蛋白质，所有可能构象约有 3^198 种，如果随机搜索，所需时间远超宇宙年龄。但自然界中蛋白质在毫秒级就能折叠完成。

这两个看似矛盾的事实指向一个结论：**蛋白质折叠不是随机搜索，而是遵循某种可由序列推断的规则**。AlphaFold 就是用 AI 学习了这个规则。

---

#### 3. AlphaFold 的核心 AI 原理

AlphaFold2 通过分析**氨基酸共进化**来预测结构：

- 如果两个氨基酸在三维结构中相互靠近（如正负电荷配对），它们在进化中会**协同突变**——一个变了，另一个也会跟着变以维持相互作用
- AlphaFold 通过**深度多序列比对（MSA）** 找出这些共进化模式
- 然后通过神经网络将共进化信号转化为三维坐标

**技术架构（简化）**：

```
输入：氨基酸序列（1D）
    ↓
搜索同源序列 → 多序列比对（MSA）→ 共进化信息
    ↓
Evoformer（48 层 Transformer 变体）→ 处理 MSA 和成对特征
    ↓
结构模块（8 层）→ 迭代优化原子坐标
    ↓
输出：3D 结构（PDB 文件）+ 置信度分数（pLDDT、PAE）
```



**AlphaFold 版本演进**：

| 版本 | 发布时间 | 核心能力 |
|------|----------|----------|
| AlphaFold2 | 2021 | 单链蛋白质结构预测，CASP14 夺冠[reference:12] |
| AlphaFold-Multimer | 2022 | 多链蛋白质复合物预测[reference:13] |
| AlphaFold3 | 2024 | 蛋白质 + DNA/RNA/配体/离子联合预测[reference:14][reference:15] |

---

#### 4. 方法一：AlphaFold Server（最简单，无需安装）

AlphaFold Server 是 Google DeepMind 提供的免费在线平台，基于 AlphaFold3 内核[reference:16]。

**前置条件**：需要 Google 账号登录[reference:17]。每天免费预测 20 个模型[reference:18]。

**操作步骤**：

1. 打开 https://alphafoldserver.com
2. 点击「Sign in」用 Google 账号登录
3. 在序列输入框中粘贴蛋白质的氨基酸序列（FASTA 格式）
4. 可选：添加 DNA、RNA、配体、离子等[reference:19]
5. 设置拷贝数（Copies）[reference:20]
6. 点击「Continue and preview job」→ 设置任务名称 → 「Confirm and launch」
7. 等待（一般不超过 10 分钟）[reference:21]
8. 下载结果（PDB 文件 + 置信度报告）

**FASTA 序列获取（从 UniProt）**：

```python
import requests

def get_uniprot_fasta(accession):
    url = f"https://rest.uniprot.org/uniprotkb/{accession}/fasta"
    resp = requests.get(url)
    return resp.text

# 获取人血红蛋白 α 亚基（P69905）的 FASTA
fasta = get_uniprot_fasta("P69905")
print(fasta)
```

---

#### 5. 方法二：ColabFold（浏览器中运行 AlphaFold2）

ColabFold 是封装好的 Google Colab 笔记本，无需安装任何软件，在浏览器中即可运行 AlphaFold2[reference:24]。

**操作步骤**：

1. 打开 ColabFold 笔记本：https://colab.research.google.com/github/sokrypton/ColabFold/blob/main/AlphaFold2.ipynb
2. 点击「Runtime」→「Change runtime type」→ 选择「GPU」
3. 在输入框中粘贴你的氨基酸序列
4. 点击「Runtime」→「Run all」
5. 等待运行完成（根据序列长度，10–60 分钟）
6. 从 `results/` 文件夹下载结果

**ColabFold 支持**：

- 单链蛋白质预测
- 多链复合物预测（蛋白-蛋白）
- 蛋白-肽段复合物预测[reference:30]

---

#### 6. 方法三：AlphaFold Database API（批量获取预计算结果）

AlphaFold Database 已包含约 2 亿个蛋白质的预计算结构[reference:31]。通过 API 可以直接获取，无需自己运行预测。

**安装依赖**：

```bash
pip install requests
```

**通过 UniProt ID 获取预测结构**：

```python
import requests

def get_afdb_structure(uniprot_id, output_format="pdb"):
    """
    从 AlphaFold Database 获取预计算结构
    uniprot_id: UniProt 登录号（如 P69905）
    output_format: "pdb" 或 "cif"
    """
    url = f"https://alphafold.ebi.ac.uk/files/AF-{uniprot_id}-F1-model_v4.{output_format}"
    resp = requests.get(url)
    if resp.status_code == 200:
        return resp.text
    else:
        return None

# 获取人血红蛋白 α 亚基的 PDB 结构
pdb_data = get_afdb_structure("P69905")
if pdb_data:
    with open("AF-P69905.pdb", "w") as f:
        f.write(pdb_data)
    print("结构已保存")
```

**通过 API 获取元数据**：

```python
def get_afdb_metadata(uniprot_id):
    """获取 AlphaFold 预测的置信度信息"""
    url = f"https://alphafold.ebi.ac.uk/api/prediction/{uniprot_id}"
    resp = requests.get(url)
    if resp.status_code == 200:
        return resp.json()
    return None

metadata = get_afdb_metadata("P69905")
if metadata:
    print("UniProt ID:", metadata.get('uniprotAccession'))
    print("平均 pLDDT:", metadata.get('meanPlddt'))
    print("是否有 PTM:", metadata.get('hasPostTranslationalModification'))
```

**AlphaFold Database API 端点速查**：

| 端点 | 用途 | 示例 |
|------|------|------|
| `/files/AF-{id}-F1-model_v4.pdb` | 下载 PDB 结构文件 | `https://alphafold.ebi.ac.uk/files/AF-P69905-F1-model_v4.pdb` |
| `/files/AF-{id}-F1-model_v4.cif` | 下载 mmCIF 结构文件 | 同上，改扩展名 |
| `/api/prediction/{id}` | 获取预测元数据（置信度等） | `https://alphafold.ebi.ac.uk/api/prediction/P69905` |
| `/api/uniprot/{id}` | 获取 UniProt 映射信息 | `https://alphafold.ebi.ac.uk/api/uniprot/P69905` |



---

#### 7. 解析 AlphaFold 输出：置信度指标

AlphaFold 输出两个关键置信度指标：

| 指标 | 全称 | 含义 | 阈值参考 |
|------|------|------|----------|
| **pLDDT** | predicted Local Distance Difference Test | 每个残基的局部置信度（0–100） | >90：极高置信；70–90：高；50–70：低；<50：不可靠 |
| **PAE** | Predicted Aligned Error | 两个残基之间的预期位置误差（Å） | 越低越好，<5Å 表示高置信 |

**解析 pLDDT 分数（从 PDB 文件）**：

```python
def parse_plddt_from_pdb(pdb_content):
    """从 PDB 文件的 B-factor 列提取 pLDDT 分数"""
    scores = []
    for line in pdb_content.split('\n'):
        if line.startswith('ATOM') and line[13:15] == 'CA':
            # B-factor 在 PDB 文件的第 61-66 列
            plddt = float(line[60:66])
            scores.append(plddt)
    return scores

plddt_scores = parse_plddt_from_pdb(pdb_data)
print(f"平均 pLDDT: {sum(plddt_scores) / len(plddt_scores):.1f}")
print(f"高置信区域 (>90): {sum(1 for s in plddt_scores if s > 90)} 个残基")
```

---

#### 8. 从序列到结构：整合前几课的知识

**完整工作流**：

```
1. 从 UniProt 获取蛋白质序列（附录 6 第三课）
       ↓
2. 用 AlphaFold Server / ColabFold 预测结构（本课）
       ↓
3. 下载 PDB/mmCIF 文件（本课）
       ↓
4. 用 Biopython PDB 解析结构（附录 6 第四课）
       ↓
5. 与实验结构（PDB）对比验证（附录 6 第四课）
```

**实战代码：从 UniProt ID 到 AlphaFold 结构解析**：

```python
import requests
from Bio.PDB import PDBParser

def uniprot_to_af_structure(uniprot_id):
    """
    从 UniProt ID 到 AlphaFold 预测结构的完整流程
    """
    # 步骤 1：获取序列（验证用）
    seq_url = f"https://rest.uniprot.org/uniprotkb/{uniprot_id}/fasta"
    seq_resp = requests.get(seq_url)
    print("序列已获取")
    
    # 步骤 2：从 AlphaFold DB 获取结构
    pdb_url = f"https://alphafold.ebi.ac.uk/files/AF-{uniprot_id}-F1-model_v4.pdb"
    pdb_resp = requests.get(pdb_url)
    if pdb_resp.status_code != 200:
        print(f"未找到 {uniprot_id} 的 AlphaFold 预测")
        return None
    
    pdb_content = pdb_resp.text
    
    # 步骤 3：用 Biopython 解析
    with open("temp.pdb", "w") as f:
        f.write(pdb_content)
    
    parser = PDBParser(QUIET=True)
    structure = parser.get_structure(uniprot_id, "temp.pdb")
    
    # 步骤 4：统计信息
    ca_count = 0
    for model in structure:
        for chain in model:
            for residue in chain:
                if 'CA' in residue:
                    ca_count += 1
    
    print(f"结构已加载，CA 原子数: {ca_count}")
    return structure

# 测试：人血红蛋白 α 亚基
structure = uniprot_to_af_structure("P69905")
```

---

#### 9. AlphaFold 的局限性与注意事项

| 局限 | 说明 |
|------|------|
| 动态构象 | 预测的是静态结构，无法捕捉蛋白质的柔性运动[reference:36] |
| 实验验证 | 预测不能替代实验，需与实验数据交叉验证[reference:37] |
| 非临床用途 | 未经临床验证，不能用于医疗决策[reference:38] |
| 长序列限制 | 超长序列（>3000 aa）预测困难[reference:39] |

---

#### 10. 本课核心命令速查表

| 操作 | 命令/地址 |
|------|-----------|
| AlphaFold Server | https://alphafoldserver.com |
| ColabFold 笔记本 | https://colab.research.google.com/github/sokrypton/ColabFold/blob/main/AlphaFold2.ipynb |
| AlphaFold DB API（PDB） | `https://alphafold.ebi.ac.uk/files/AF-{id}-F1-model_v4.pdb` |
| AlphaFold DB API（元数据） | `https://alphafold.ebi.ac.uk/api/prediction/{id}` |
| 获取 UniProt FASTA | `https://rest.uniprot.org/uniprotkb/{id}/fasta` |

---

#### 11. 本课小结

- **AlphaFold 是 AI 在生物学中最成功的应用之一**，用深度学习解决了蛋白质结构预测这一半个世纪的科学难题[reference:40]
- **三种使用方式**：AlphaFold Server（Web 界面，最简单）、ColabFold（浏览器运行，需 GPU）、AlphaFold DB API（批量获取预计算结果）
- **核心 AI 技术**：多序列比对（MSA）+ Evoformer（Transformer 变体）+ 结构模块
- **置信度评估**：pLDDT（局部置信度）和 PAE（成对误差）是判断预测质量的关键指标
- **与前文衔接**：UniProt 提供序列（第三课）→ AlphaFold 预测结构（本课）→ Biopython PDB 解析（第四课），形成完整的生物信息学分析链条

---

#### 12. 课后练习

1. 用 AlphaFold Server 预测一个你感兴趣的蛋白质结构（可从 UniProt 获取序列）。

2. 用 AlphaFold Database API 下载 TP53（UniProt ID: P04637）的预测结构。

3. 用 Biopython 解析下载的 PDB 文件，统计其链数、残基数和平均 pLDDT 分数。

4. 将 AlphaFold 预测结构与 PDB 数据库中对应的实验结构（如有）进行对比，观察差异。

5. 写一个 Python 函数，输入 UniProt ID，自动下载并解析其 AlphaFold 预测结构，返回 CA 原子坐标列表。

## 附录 7：实战
###思路
核心思路是构建一个 “无服务器全栈分析管道”：用户通过 GitHub Pages 托管的静态前端上传 FASTA/FASTQ/PDB 生物文件，前端将文件内容和指令打包发给 Cloudflare Worker（作为安全代理网关），Worker 隐藏 API 密钥并转发请求至 OpenRouter 平台。

核心模型选用 NVIDIA Nemotron-3.5-Lightning（免费版，nvidia/nemotron-3.5-lightning:free），利用其 100 万 Token 超大上下文窗口，直接原样塞入原始文件内容，配合精心设计的 System Prompt（针对不同文件格式的解析模板）引导模型生成结构化的 Markdown 分析报告（含统计表格、GC 含量、测序质量或结构解析），最终通过 SSE 流式输出回前端，实现“上传即分析、逐字渲染”的体验。

简单说，就是拿大模型当“生物信息学解读者”，前端负责颜值和交互，Worker 负责安全中 转，模型负责从原始序列/结构数据中提取生物学意义。
### 第一课：架构准备与 OpenRouter 配置

本课目标：

- 明确项目的最终目标（网页端上传生物文件 → 后端代理 → LLM 分析输出）

- 理解“GitHub Pages 前端 + Cloudflare Worker 后端 + OpenRouter API”的架构

- 注册 OpenRouter 并获取 API Key

- 创建 GitHub 仓库和 Cloudflare Worker 空项目

- 配置 Worker 环境变量（用于安全存储 API Key）

---

#### 1. 项目最终形态（一图胜千言）

```
用户浏览器（GitHub Pages 托管的前端页面）
        ↓ 上传 .fasta / .fastq / .pdb 文件
Cloudflare Worker（你写的中转 API）
        ↓ 转发请求（携带 API Key）
OpenRouter API（nvidia/nemotron-3.5-lightning:free）
        ↓ 返回分析结果
前端页面：展示结构化的生物信息分析报告
```

**全部代码量**：约 300 行前端 JS + 80 行 Worker JS。

---

#### 2. 技术栈确认（沿用附录 3 的工具）

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | 原生 HTML5 + CSS3 + JavaScript（ES6） | 不引入 React/Vue，降低门槛 |
| 前端样式 | Bootstrap 5 CDN | 快速美观，响应式 |
| 文件解析 | 前端原生 FileReader | 读取文本格式的 FASTA/FASTQ/PDB |
| 后端 | Cloudflare Workers | 全球边缘节点，免费额度充足 |
| 数据库 | 不需要（本次不用持久化） | 纯分析管道 |
| LLM API | OpenRouter | 统一网关，免费访问 Nemotron |
| 模型 | `nvidia/nemotron-3.5-lightning:free` | 316B MoE，100万上下文 |

---

#### 3. OpenRouter 注册与 API Key 获取

**步骤 1：注册账号**

1. 打开 https://openrouter.ai

2. 点击右上角 **Sign Up**，用邮箱注册并验证

**步骤 2：获取 API Key**

1. 登录后，点击右上角头像 → **Settings**

2. 左侧菜单点击 **API Keys**

3. 点击 **Create API Key**

4. 输入 Key 名称（如 `bio_analyst`）

5. 复制生成的 Key（格式：`sk-or-v1-...`），**只显示一次，立即保存**

**步骤 3：验证 Key 是否可用（在终端或 AidLux 中）**

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-or-v1-你的密钥" \
  -d '{
    "model": "nvidia/nemotron-3.5-lightning:free",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

如果返回 JSON 响应而非错误，说明 Key 可用。

**重要限制提醒（教学够用）**：

- 免费模型：**50 次请求 / 天**（账户级，所有免费模型共享）

- 请合理规划课堂演示，避免频繁测试浪费额度

- 充值 $10 后提升至 1000 次 / 天（可选）

---

#### 4. 创建 GitHub 仓库（存放前端）

**方式一：网页创建（推荐）**

1. 登录 GitHub，点击右上角 **+** → **New repository**

2. 仓库名输入 `bio-llm-analyzer`

3. 选择 **Public**

4. 勾选 **Add a README file**

5. 点击 **Create repository**

**方式二：命令行创建（备选）**

```bash
mkdir bio-llm-analyzer
cd bio-llm-analyzer
git init
echo "# Bio LLM Analyzer" > README.md
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/bio-llm-analyzer.git
git push -u origin main
```

---

#### 5. 创建 Cloudflare Worker 空项目

**方式一：Dashboard 网页创建（推荐新手）**

1. 登录 Cloudflare Dashboard → **Workers & Pages**

2. 点击 **Create application** → **Create Worker**

3. 输入名称：`bio-llm-api`

4. 点击 **Deploy**

5. 部署后点击 **Edit code** 进入在线编辑器

**方式二：Wrangler CLI（熟练用户）**

```bash
# 安装 Wrangler（如未安装）
npm install -g wrangler

# 登录
wrangler login

# 创建项目
wrangler init bio-llm-api

# 进入目录
cd bio-llm-api
```

---

#### 6. 在 Worker 中配置环境变量（安全存储 API Key）

**重要**：永远不要将 API Key 硬编码在 Worker 代码中（代码公开可读）。使用环境变量。

**操作步骤**（Dashboard）：

1. 进入 Worker `bio-llm-api` 详情页

2. 点击 **Settings** → **Variables**

3. 在 **Environment Variables** 区域：

   - 点击 **Add variable**

   - 变量名：`OPENROUTER_API_KEY`

   - 值：`sk-or-v1-你的密钥`

   - 点击 **Save and deploy**

**在代码中访问环境变量**：

```javascript
// Worker 代码中通过 env.OPENROUTER_API_KEY 获取
const apiKey = env.OPENROUTER_API_KEY;
```

**其他需要配置的变量（可选）**：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `OPENROUTER_MODEL` | `nvidia/nemotron-3.5-lightning:free` | 模型名（可后续切换） |
| `MAX_TOKENS` | `4096` | 输出最大长度 |

---

#### 7. 本课核心信息速查表

| 项目 | 值 |
|------|-----|
| OpenRouter API Base | `https://openrouter.ai/api/v1` |
| 模型 ID | `nvidia/nemotron-3.5-lightning:free` |
| 上下文窗口 | 100 万 Token |
| 免费日限额 | 50 次 / 天 |
| 环境变量名 | `OPENROUTER_API_KEY` |
| 前端仓库名 | `bio-llm-analyzer` |
| Worker 名称 | `bio-llm-api` |

---

#### 8. 本课小结

- **后端是“安全的代理”**：Worker 作为前端和 OpenRouter 之间的桥梁，隐藏 API Key

- **前端是“美化的界面”**：GitHub Pages 托管静态 HTML，负责上传文件和展示结果

- **LLM 是“分析引擎”**：Nemotron 处理生物数据并生成可读报告

- **环境变量**是 Worker 中存储敏感信息的标准做法

---

#### 9. 课后练习（准备工作确认）

1. 注册 OpenRouter，获取 API Key，用 `curl` 测试连通性。

2. 创建 GitHub 仓库 `bio-llm-analyzer`，克隆到本地（或准备后续网页上传）。

3. 创建 Cloudflare Worker `bio-llm-api`，在 Settings → Variables 中添加 `OPENROUTER_API_KEY`。

4. 用浏览器访问你的 Worker 默认地址，确认返回 Hello World（证明 Worker 可访问）。

### 第二课：Cloudflare Worker 代理 —— 转发请求到 OpenRouter

本课目标：

- 在 Worker 中编写完整的 HTTP 代理（接收前端请求 → 转发 OpenRouter → 返回响应）

- 支持非流式（一次性返回）和流式（SSE 逐块输出）两种模式

- 添加错误处理、超时控制、CORS 头

- 理解 Worker 与前端之间的数据格式约定

- 配置 Worker 路由（只开放必要的端点）

---

#### 1. Worker 架构设计（代理 + 安全隔离）

Worker 的作用是“安全的中间人”：

- **接收**：前端发来的 POST 请求（包含生物数据文件和指令）
- **转发**：将请求重组为 OpenRouter 格式，携带环境变量中的 API Key
- **返回**：将 OpenRouter 的响应原样或加工后返回给前端

**为什么需要 Worker 代理而不直接前端调 OpenRouter**：

| 问题 | 前端直接调 OpenRouter | Worker 代理方案 |
|------|----------------------|-----------------|
| API Key 暴露 | ❌ 前端代码公开，Key 可被窃取 | ✅ Key 存储在环境变量中，前端不可见 |
| CORS 跨域 | ❌ 需要配置复杂的 CORS 白名单 | ✅ Worker 可自定义 CORS 头，灵活控制 |
| 请求限制 | ❌ 前端无法做统一的速率控制 | ✅ Worker 可做限流和频率控制 |
| 日志审计 | ❌ 难以追踪请求来源 | ✅ Worker 可记录所有请求日志 |

---

#### 2. Worker 代码（完整版）

将以下代码粘贴到 Cloudflare Worker 在线编辑器中，替换默认的 Hello World：

```javascript
// 环境变量：OPENROUTER_API_KEY 在 Settings → Variables 中设置
// OPENROUTER_MODEL 可选，默认 nvidia/nemotron-3.5-lightning:free

export default {
  async fetch(request, env, ctx) {
    // 1. 只接受 POST 请求
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() }
      });
    }

    // 2. 解析请求体
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() }
      });
    }

    // 3. 校验必需字段
    const { messages, stream = false, file_content = null, file_type = null } = requestBody;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'messages is required and must be a non-empty array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() }
      });
    }

    // 4. 如果是生物文件分析，将文件内容注入到 system prompt 或 user message 中
    let finalMessages = messages;
    if (file_content && file_type) {
      const fileContext = buildFileContext(file_content, file_type);
      // 将文件信息添加到 system message 或附加到最后一个 user message
      const systemMsg = finalMessages.find(m => m.role === 'system');
      if (systemMsg) {
        systemMsg.content = systemMsg.content + '\n\n' + fileContext;
      } else {
        // 插入一个 system message 到开头
        finalMessages = [
          { role: 'system', content: `你是一个专业的生物信息学分析助手。用户上传了一个 ${file_type} 文件。请基于文件内容进行分析。\n\n${fileContext}` },
          ...finalMessages
        ];
      }
    }

    // 5. 构建 OpenRouter 请求体
    const openrouterPayload = {
      model: env.OPENROUTER_MODEL || 'nvidia/nemotron-3.5-lightning:free',
      messages: finalMessages,
      stream: stream,
      max_tokens: requestBody.max_tokens || 4096,
      temperature: requestBody.temperature || 0.7
    };

    // 6. 转发到 OpenRouter API
    const openrouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': request.headers.get('Referer') || 'https://github.com/your-repo',
        'X-Title': 'Bio LLM Analyzer'
      },
      body: JSON.stringify(openrouterPayload)
    });

    // 7. 处理响应
    if (!openrouterResponse.ok) {
      const errorText = await openrouterResponse.text();
      return new Response(JSON.stringify({
        error: 'OpenRouter API error',
        status: openrouterResponse.status,
        detail: errorText
      }), {
        status: openrouterResponse.status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() }
      });
    }

    // 8. 流式 vs 非流式
    if (stream) {
      // 流式：直接转发 SSE 流
      return new Response(openrouterResponse.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          ...corsHeaders()
        }
      });
    } else {
      // 非流式：解析 JSON 后返回
      const data = await openrouterResponse.json();
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders() }
      });
    }
  }
};

// CORS 头工具函数
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}

// 根据文件类型构造上下文提示
function buildFileContent(file_content, file_type) {
  const fileTypeName = {
    'fasta': 'FASTA 序列文件',
    'fastq': 'FASTQ 测序文件',
    'pdb': 'PDB 三维结构文件'
  }[file_type] || file_type;

  // 截断过长内容（避免超过上下文窗口）
  const maxPreviewLength = 20000; // 20k 字符预览
  const preview = file_content.length > maxPreviewLength
    ? file_content.slice(0, maxPreviewLength) + '\n... (内容过长，已截断)'
    : file_content;

  return `文件类型: ${fileTypeName}\n文件内容:\n${preview}`;
}
```

---

#### 3. 代码逐段解释（学生必看）

| 代码段 | 作用 |
|--------|------|
| `if (request.method !== 'POST')` | 只允许 POST，其他方法返回 405 |
| `await request.json()` | 解析前端传来的 JSON 请求体 |
| `const { messages, stream, file_content, file_type } = requestBody` | 解构出前端传入的参数 |
| `buildFileContext()` | 将用户上传的 FASTA/FASTQ/PDB 文件内容拼接到系统提示词中 |
| `env.OPENROUTER_API_KEY` | 从环境变量读取 API Key（安全！） |
| `fetch('https://openrouter.ai/api/v1/chat/completions', ...)` | 转发到 OpenRouter |
| `if (stream)` | 流式返回 SSE，否则返回完整 JSON |

---

#### 4. 前端 → Worker 的请求格式约定

前端发送的请求体（JSON）必须包含以下字段：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `messages` | array | ✅ | OpenAI 格式的消息数组，`role` + `content` |
| `stream` | boolean | ❌ | 是否流式输出，默认 `false` |
| `file_content` | string | ❌ | 用户上传的文件内容（纯文本） |
| `file_type` | string | ❌ | 文件类型：`fasta` / `fastq` / `pdb` |
| `max_tokens` | number | ❌ | 最大输出 Token，默认 4096 |
| `temperature` | number | ❌ | 温度参数，默认 0.7 |

**前端示例（非流式）**：

```javascript
const response = await fetch('https://bio-llm-api.你的用户名.workers.dev', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'system', content: '你是一个生物信息学助手' },
      { role: 'user', content: '分析这段序列的GC含量' }
    ],
    file_content: '>BRCA1\nATCGATCG...',
    file_type: 'fasta',
    stream: false
  })
});
const data = await response.json();
```

---

#### 5. Worker 响应格式（非流式）

Worker 非流式响应直接返回 OpenRouter 的 JSON 格式（OpenAI 兼容）：

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "nvidia/nemotron-3.5-lightning:free",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "分析结果：该序列长度1200bp，GC含量为45.2%..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 200,
    "total_tokens": 350
  }
}
```

前端解析时通过 `data.choices[0].message.content` 获取分析结果。

---

#### 6. 流式响应格式（SSE）

当 `stream: true` 时，Worker 直接转发 OpenRouter 的 SSE 流，格式为：

```
data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"分析"}}]}
data: {"id":"chatcmpl-xxx","object":"chat.completion.chunk","choices":[{"index":0,"delta":{"content":"结果"}}]}
...
data: [DONE]
```

前端按标准 SSE 解析即可：

```javascript
const response = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ stream: true, messages: [...] }) });
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const payload = line.slice(6);
      if (payload === '[DONE]') return;
      try {
        const parsed = JSON.parse(payload);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) console.log(content); // 逐块打印
      } catch (e) { /* 忽略非 JSON 行 */ }
    }
  }
}
```

---

#### 7. 错误处理与状态码

Worker 可能返回的 HTTP 状态码及含义：

| 状态码 | 含义 | 前端处理建议 |
|--------|------|-------------|
| 200 | 成功（非流式） | 正常解析 JSON |
| 200（SSE） | 成功（流式） | 逐块解析 data 行 |
| 400 | 请求体格式错误或缺少字段 | 检查 messages 是否为空数组 |
| 405 | 使用了非 POST 方法 | 改用 POST |
| 429 | OpenRouter 频率限制（免费 50次/天） | 提示用户“今日免费额度已用完” |
| 500 | OpenRouter 内部错误 | 显示错误详情 |
| 502 | Worker 或 OpenRouter 超时 | 提示“服务暂时不可用，请稍后重试” |

---

#### 8. 部署 Worker（确认步骤）

1. 在 Cloudflare Worker 在线编辑器中粘贴完整代码

2. 点击 **Save and Deploy**

3. 部署后，Worker 地址为 `https://bio-llm-api.你的用户名.workers.dev`

4. 用 `curl` 测试 Worker 是否正常工作：

```bash
curl -X POST https://bio-llm-api.你的用户名.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"stream":false}'
```

如果返回 OpenRouter 的 JSON 响应，说明 Worker 配置成功。

---

#### 9. 常见错误与解决

| 错误现象 | 原因 | 解决 |
|----------|------|------|
| `OPENROUTER_API_KEY is undefined` | 环境变量未设置 | 在 Worker Settings → Variables 中添加 `OPENROUTER_API_KEY` |
| `401 Unauthorized` | API Key 无效或过期 | 去 OpenRouter 重新生成 Key |
| `429 Too Many Requests` | 免费模型日限额耗尽（50次/天） | 充值 $10 提升限制，或次日再试 |
| `Model not found` | 模型名拼写错误 | 确认 `nvidia/nemotron-3.5-lightning:free` |
| CORS 错误 | Worker 未返回 CORS 头 | 确认代码中包含 `corsHeaders()` |
| 前端收不到流式数据 | SSE 格式不正确 | 确保 Worker 返回 `text/event-stream` 和正确的 data 格式 |

---

#### 10. 本课核心命令速查表

| 操作 | 命令 |
|------|------|
| 测试 Worker（curl） | `curl -X POST https://bio-llm-api.xxx.workers.dev -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"Hi"}]}'` |
| 测试 OpenRouter（curl） | `curl https://openrouter.ai/api/v1/chat/completions -H "Authorization: Bearer sk-or-..." -d '{"model":"nvidia/nemotron-3.5-lightning:free","messages":[{"role":"user","content":"Hi"}]}'` |
| 前端 fetch（非流式） | `fetch(worker_url, {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({messages:..., stream:false})})` |
| 前端 fetch（流式） | 同上，`stream: true`，然后用 `response.body.getReader()` 读取 |

---

#### 11. 本课小结

- **Worker 是后端代理**，接收前端请求 → 转发 OpenRouter → 返回响应
- **环境变量**存储 API Key，前端不可见，安全隔离
- **支持两种模式**：非流式（简单）和流式（逐字输出，体验好）
- **错误处理**覆盖了请求格式校验、API Key 失效、频率限制等常见场景
- **CORS 头**让前端可以跨域调用 Worker

---

#### 12. 课后练习

1. 部署本课的 Worker 代码，用 `curl` 测试返回是否正确。

2. 修改 Worker 代码，增加一个 `system` 提示词，让模型“用中文回答所有问题”。

3. 测试流式模式：在前端用 `fetch` 发送 `stream: true`，在 Console 中逐块打印输出。

4. 故意使用错误的 API Key，观察 Worker 返回的 401 错误格式。


### 第三课：前端界面开发 —— 用 Bootstrap 5 搭建生物分析面板

本课目标：

- 用 Bootstrap 5 快速构建响应式、美观的单页应用

- 实现文件上传控件（支持点击选择 + 拖拽上传）

- 读取 FASTA / FASTQ / PDB 文件内容并在前端预览

- 构建请求体，调用 Cloudflare Worker API（非流式 + 流式）

- 实时显示分析进度（加载动画、流式输出打字机效果）

- 渲染分析结果（表格、代码块、结构化数据）

---

#### 1. 界面布局设计（上中下三栏）

| 区域 | 内容 | Bootstrap 组件 |
|------|------|----------------|
| 导航栏 | 项目名称 + GitHub 链接 | `.navbar` |
| 主内容 | 文件上传区 + 参数设置 + 分析按钮 | `.container` + `.card` + `.row` |
| 结果区 | 分析报告（文本 + 表格） | `.card` + `.card-body` |

**配色方案**：

- 主色：`#2c3e50`（深蓝灰），辅色：`#3498db`（亮蓝），背景：`#f8f9fa`

---

#### 2. 完整前端代码（`index.html`）

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🧬 Bio LLM Analyzer</title>
    <!-- Bootstrap 5 + Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <!-- 可选：Markdown 渲染库（轻量） -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <style>
        body { background: #f4f6f9; font-family: 'Segoe UI', sans-serif; }
        .hero { background: linear-gradient(135deg, #2c3e50, #3498db); color: white; padding: 40px 0 30px; margin-bottom: 30px; }
        .hero h1 { font-weight: 700; }
        .upload-zone {
            border: 2px dashed #ccc;
            border-radius: 12px;
            padding: 40px 20px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s;
            background: #fafafa;
        }
        .upload-zone:hover { border-color: #3498db; background: #eef6ff; }
        .upload-zone.dragover { border-color: #2ecc71; background: #eafaf1; }
        #fileInfo { margin-top: 10px; font-weight: 500; }
        #previewArea {
            max-height: 300px;
            overflow-y: auto;
            background: #f8f9fa;
            border-radius: 8px;
            padding: 12px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            white-space: pre-wrap;
            word-break: break-all;
        }
        #resultArea {
            min-height: 200px;
            background: #ffffff;
            border-radius: 8px;
            padding: 20px;
            border: 1px solid #ddd;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        #resultArea .markdown-body { font-family: inherit; }
        .stream-cursor::after {
            content: '▍';
            animation: blink 1s step-end infinite;
            color: #3498db;
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .badge-filetype { font-size: 0.8rem; margin-left: 8px; }
        .loading-spinner { display: none; }
    </style>
</head>
<body>
    <!-- 导航栏 -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand" href="#"><i class="bi bi-gene"></i> BioLLM Analyzer</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="#" onclick="loadSample()"><i class="bi bi-file-earmark-text"></i> 示例数据</a></li>
                    <li class="nav-item"><a class="nav-link" href="https://github.com/你的用户名/bio-llm-analyzer" target="_blank"><i class="bi bi-github"></i> GitHub</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero -->
    <section class="hero">
        <div class="container text-center">
            <h1><i class="bi bi-robot"></i> 生物数据智能分析</h1>
            <p class="lead">上传 FASTA / FASTQ / PDB 文件，AI 自动生成分析报告</p>
            <span class="badge bg-light text-dark"><i class="bi bi-arrow-right"></i> 支持 .fasta .fastq .pdb</span>
            <span class="badge bg-light text-dark ms-2"><i class="bi bi-cpu"></i> 模型: Nemotron-3.5 Lightning (免费)</span>
        </div>
    </section>

    <!-- 主内容 -->
    <div class="container">
        <div class="row g-4">
            <!-- 左侧：上传与设置 -->
            <div class="col-lg-5">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title"><i class="bi bi-upload"></i> 上传文件</h5>
                        <!-- 拖拽/点击上传区 -->
                        <div id="dropZone" class="upload-zone">
                            <i class="bi bi-cloud-upload" style="font-size: 2.5rem; color: #3498db;"></i>
                            <p class="mt-2">点击选择 或 拖拽文件至此</p>
                            <small class="text-muted">支持 .fasta, .fastq, .pdb</small>
                            <input type="file" id="fileInput" accept=".fasta,.fa,.fastq,.fq,.pdb" style="display:none;">
                        </div>
                        <div id="fileInfo" class="mt-2"></div>
                        <div id="previewArea" style="display:none;"></div>

                        <hr>
                        <h6><i class="bi bi-sliders"></i> 分析参数</h6>
                        <div class="mb-2">
                            <label class="form-label">分析模式</label>
                            <select id="analysisMode" class="form-select form-select-sm">
                                <option value="general">通用分析</option>
                                <option value="gc">GC 含量分析</option>
                                <option value="structure">结构注释 (PDB)</option>
                                <option value="variant">突变解读 (FASTQ)</option>
                            </select>
                        </div>
                        <div class="mb-2">
                            <label class="form-label">输出风格</label>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="style" id="styleConcise" value="concise" checked>
                                <label class="form-check-label" for="styleConcise">简洁</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="style" id="styleDetailed" value="detailed">
                                <label class="form-check-label" for="styleDetailed">详细</label>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">额外指令（可选）</label>
                            <input type="text" id="customPrompt" class="form-control form-control-sm" placeholder="例如：重点关注保守结构域">
                        </div>

                        <button id="analyzeBtn" class="btn btn-primary w-100" disabled>
                            <i class="bi bi-play-circle"></i> 开始分析
                        </button>
                        <div class="loading-spinner text-center mt-3">
                            <div class="spinner-border text-primary spinner-border-sm" role="status"></div>
                            <span class="ms-2">AI 正在思考...</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧：结果展示 -->
            <div class="col-lg-7">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title"><i class="bi bi-file-earmark-text"></i> 分析报告</h5>
                            <span id="tokenUsage" class="badge bg-secondary">Token: --</span>
                        </div>
                        <div id="resultArea">
                            <p class="text-muted">等待分析……</p>
                        </div>
                        <div class="mt-2 text-end">
                            <button id="copyBtn" class="btn btn-outline-secondary btn-sm" disabled><i class="bi bi-clipboard"></i> 复制</button>
                            <button id="downloadBtn" class="btn btn-outline-success btn-sm" disabled><i class="bi bi-download"></i> 下载报告</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="text-center text-muted py-3 mt-4">
        <small>🔬 基于 OpenRouter + NVIDIA Nemotron-3.5 Lightning | 每日免费 50 次请求</small>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // ======================== 配置 ========================
        const WORKER_URL = 'https://bio-llm-api.你的用户名.workers.dev'; // 替换为你的 Worker 地址
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB 限制（自由调整）

        // ======================== DOM 引用 ========================
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        const fileInfo = document.getElementById('fileInfo');
        const previewArea = document.getElementById('previewArea');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const resultArea = document.getElementById('resultArea');
        const tokenUsage = document.getElementById('tokenUsage');
        const loadingSpinner = document.querySelector('.loading-spinner');
        const copyBtn = document.getElementById('copyBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const analysisMode = document.getElementById('analysisMode');
        const styleConcise = document.getElementById('styleConcise');
        const styleDetailed = document.getElementById('styleDetailed');
        const customPrompt = document.getElementById('customPrompt');

        let currentFile = null;        // { name, content, type }
        let isStreaming = false;

        // ======================== 文件上传逻辑 ========================
        // 点击触发文件选择
        dropZone.addEventListener('click', () => fileInput.click());

        // 文件选择变化
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
        });

        // 拖拽事件
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                handleFile(e.dataTransfer.files[0]);
            }
        });

        // 处理单个文件
        function handleFile(file) {
            // 大小检查
            if (file.size > MAX_FILE_SIZE) {
                alert(`文件过大（${(file.size/1024/1024).toFixed(1)}MB），请上传小于 ${MAX_FILE_SIZE/1024/1024}MB 的文件`);
                return;
            }
            // 类型检查（仅扩展名）
            const validExts = ['.fasta', '.fa', '.fastq', '.fq', '.pdb'];
            const ext = '.' + file.name.split('.').pop().toLowerCase();
            if (!validExts.includes(ext)) {
                alert('仅支持 .fasta, .fastq, .pdb 格式');
                return;
            }

            // 读取内容
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                // 检测文件类型（基于内容或扩展名）
                let fileType = ext.slice(1); // 去掉点
                if (fileType === 'fa' || fileType === 'fasta') fileType = 'fasta';
                if (fileType === 'fq' || fileType === 'fastq') fileType = 'fastq';
                // 简易检测：若内容含 '>' 则为 FASTA
                if (content.startsWith('>')) fileType = 'fasta';
                else if (content.startsWith('@')) fileType = 'fastq';
                else if (content.startsWith('HEADER')) fileType = 'pdb';

                currentFile = { name: file.name, content, type: fileType };
                // 更新界面
                fileInfo.innerHTML = `<i class="bi bi-check-circle text-success"></i> ${file.name} (${fileType.toUpperCase()}) - ${(file.size/1024).toFixed(1)} KB`;
                previewArea.style.display = 'block';
                previewArea.textContent = content.slice(0, 2000) + (content.length > 2000 ? '\n... (截断)' : '');
                analyzeBtn.disabled = false;
                // 自动切换模式建议
                if (fileType === 'fastq') analysisMode.value = 'variant';
                else if (fileType === 'pdb') analysisMode.value = 'structure';
                else analysisMode.value = 'gc';
            };
            reader.onerror = function() {
                alert('读取文件失败，请检查文件是否损坏');
            };
            reader.readAsText(file, 'UTF-8');
        }

        // ======================== 加载示例数据 ========================
        function loadSample() {
            // 示例 BRCA1 序列片段
            const sample = `>BRCA1 human
ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAGAAAATCTTAGAGTGTCCCATCTGTCTGGAGTTGATCAAGGAACCTGTCTCCACAAAGTGTGACCACATATTTTGCAAATTTTGTATGCTGAAACTTCTCAACCAGAAGAAAGGGCCTTCACAGTGTCCTTTATGTAAGAATGATATAACCAAAAGGAGCCTACAAGAAAGTACGAGATTTAGTCAACTTGTTGAAGAGCTATTGAAAATCATTTGTGCTTTTCAGCTTGACACAGGTTTGGAGTATGCAAACAGCTATAATTTTGCAAAAAAGGAAAATAACTCTCCTGAACATCTAAAAGATGAAGTTTCTATCATCCAAAGTATGGGCTACAGAAACCGTGCCAAAAGACTTCTACAGAGTGAACCCGAAAATCCTTCCTTGCAGGAAACCAGTCTCAGTGTCCAACTCTCTAACCTTGGAACTGTGAGAACTCTGAGGACAAAGAGCGGGG`;
            // 模拟 file
            const blob = new Blob([sample], { type: 'text/plain' });
            const file = new File([blob], 'BRCA1_sample.fasta', { type: 'text/plain' });
            // 触发 handleFile
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
            fileInput.dispatchEvent(new Event('change'));
        }

        // ======================== 分析核心 ========================
        analyzeBtn.addEventListener('click', async () => {
            if (!currentFile) return;
            if (isStreaming) return;

            // 获取参数
            const mode = analysisMode.value;
            const style = document.querySelector('input[name="style"]:checked').value;
            const extraPrompt = customPrompt.value.trim();

            // 构造系统提示词
            let systemPrompt = `你是一个生物信息学分析专家。用户上传了一个 ${currentFile.type.toUpperCase()} 文件。`;
            // 根据模式定制
            const modeMap = {
                'gc': '请计算序列长度、GC含量、AT含量，并给出序列的基本统计特征。',
                'structure': '请分析该PDB结构：分辨率、链数、残基数、二级结构组成（螺旋/折叠/转角），并指出可能的功能区域。',
                'variant': '请从FASTQ文件中提取测序质量、覆盖度，并注释可能的SNP或变异。',
                'general': '请对该生物数据进行全面分析，包括序列特征、结构注释（若适用）等。'
            };
            systemPrompt += ` ${modeMap[mode] || modeMap['general']}`;
            if (style === 'detailed') systemPrompt += ' 请提供详细的分析报告，包括数据来源、方法、结果和讨论。';
            else systemPrompt += ' 请提供简洁清晰的结论，突出关键指标。';
            if (extraPrompt) systemPrompt += ` 额外要求：${extraPrompt}`;

            // 用户消息：仅包含文件内容（已在Worker中拼接，但这里也可以直接传文件内容）
            // 我们采用Worker拼接方式：在请求中同时传file_content和file_type
            // 并将用户消息置为"请分析"。
            const userMessage = `请分析我上传的 ${currentFile.type.toUpperCase()} 文件。`;

            // 构建请求体
            const payload = {
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                file_content: currentFile.content,
                file_type: currentFile.type,
                stream: true,   // 总是流式，以获得更好的用户体验
                max_tokens: 4096,
                temperature: 0.3
            };

            // UI 状态
            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> 分析中...';
            loadingSpinner.style.display = 'block';
            resultArea.innerHTML = '<div class="stream-cursor">分析结果：</div>';
            copyBtn.disabled = true;
            downloadBtn.disabled = true;
            tokenUsage.textContent = 'Token: ...';
            isStreaming = true;

            try {
                const response = await fetch(WORKER_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    let errMsg = `请求失败 (${response.status})`;
                    try {
                        const errData = await response.json();
                        errMsg = errData.error || errMsg;
                    } catch (e) {}
                    throw new Error(errMsg);
                }

                // 流式读取
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let resultText = '';
                let done = false;
                let usage = null;

                while (!done) {
                    const { value, done: doneReading } = await reader.read();
                    done = doneReading;
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                    // 处理 SSE 数据行
                    const lines = chunk.split('\n');
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const payloadStr = line.slice(6);
                            if (payloadStr === '[DONE]') {
                                done = true;
                                break;
                            }
                            try {
                                const parsed = JSON.parse(payloadStr);
                                const delta = parsed.choices?.[0]?.delta?.content;
                                if (delta) {
                                    resultText += delta;
                                    // 更新显示（带光标效果）
                                    resultArea.innerHTML = `<div class="stream-cursor">${escapeHtml(resultText)}</div>`;
                                    // 滚动到底部
                                    resultArea.scrollTop = resultArea.scrollHeight;
                                }
                                // 尝试获取 usage（在最后一条非流式消息中可能包含）
                                if (parsed.usage) {
                                    usage = parsed.usage;
                                }
                            } catch (e) { /* 忽略非 JSON 行 */ }
                        }
                    }
                }

                // 最终完整显示
                resultArea.innerHTML = `<div>${escapeHtml(resultText)}</div>`;
                if (resultText.trim() === '') {
                    resultArea.innerHTML = '<p class="text-warning">模型未返回任何内容，请重试。</p>';
                }

                // 显示 Token 使用情况（若未获取到，尝试从响应头或其它方式获取，这里简单提示）
                if (usage) {
                    tokenUsage.textContent = `Token: ${usage.total_tokens || 'N/A'}`;
                } else {
                    tokenUsage.textContent = `Token: 已使用（未统计）`;
                }

                copyBtn.disabled = false;
                downloadBtn.disabled = false;

            } catch (error) {
                console.error(error);
                resultArea.innerHTML = `<div class="alert alert-danger">❌ 分析出错：${error.message}</div>`;
                tokenUsage.textContent = 'Token: 错误';
            } finally {
                analyzeBtn.disabled = false;
                analyzeBtn.innerHTML = '<i class="bi bi-play-circle"></i> 开始分析';
                loadingSpinner.style.display = 'none';
                isStreaming = false;
            }
        });

        // ======================== 辅助函数 ========================
        function escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        // 复制结果
        copyBtn.addEventListener('click', () => {
            const text = resultArea.textContent;
            navigator.clipboard.writeText(text).then(() => {
                alert('报告已复制到剪贴板');
            }).catch(() => {
                // fallback
                const range = document.createRange();
                range.selectNode(resultArea);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                document.execCommand('copy');
                alert('报告已复制');
            });
        });

        // 下载报告
        downloadBtn.addEventListener('click', () => {
            const text = resultArea.textContent;
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `analysis_${new Date().toISOString().slice(0,10)}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        // 支持键盘快捷键 (Ctrl+Enter 触发分析)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                if (!analyzeBtn.disabled) analyzeBtn.click();
            }
        });

        console.log('🧬 BioLLM Analyzer 已加载，Worker 地址:', WORKER_URL);
    </script>
</body>
</html>
```

---

#### 3. 代码逐块解释

| 代码块 | 作用 |
|--------|------|
| **Bootstrap 引入** | 使用 CDN 加载 Bootstrap 5 和 Bootstrap Icons，确保响应式布局 |
| **自定义 CSS** | 美化上传区（拖拽高亮）、流式光标动画、滚动条样式等 |
| **文件上传** | 使用 `FileReader` 读取文本内容，检测文件类型（FASTA/FASTQ/PDB），预览前 2000 字符 |
| **参数选择** | 分析模式（通用/GC/结构/变异）、输出风格（简洁/详细）、额外指令输入框 |
| **核心分析函数** | 构建 `system` 和 `user` 消息，附带 `file_content` 和 `file_type`，调用 Worker API |
| **流式渲染** | 使用 `response.body.getReader()` 逐块读取 SSE 数据，更新 `resultArea` 实现打字机效果 |
| **结果后处理** | 复制文本、下载为 TXT 文件、显示 Token 使用情况（若返回） |
| **示例数据** | 内置 BRCA1 序列片段，一键填充演示 |
| **键盘快捷键** | `Ctrl+Enter` 触发分析，提升操作效率 |

---

#### 4. 前端与 Worker 的通信协议（回顾）

| 请求字段 | 类型 | 说明 |
|----------|------|------|
| `messages` | array | 对话消息（system, user） |
| `file_content` | string | 文件全文（纯文本） |
| `file_type` | string | `fasta` / `fastq` / `pdb` |
| `stream` | boolean | 始终 `true`（本设计使用流式） |
| `max_tokens` | number | 4096 |
| `temperature` | number | 0.3 |

Worker 会将 `file_content` 和 `file_type` 拼接到系统消息中，然后转发给 OpenRouter。

---

#### 5. 部署与测试

1. **修改 Worker URL**：在 `index.html` 中替换 `WORKER_URL` 为你的 Cloudflare Worker 地址。

2. **上传到 GitHub**：

   - 将 `index.html` 推送到 `bio-llm-analyzer` 仓库

   - 启用 GitHub Pages（Settings → Pages → 选择 main 分支）

3. **打开 Pages 地址**：`https://你的用户名.github.io/bio-llm-analyzer/`

4. **测试流程**：

   - 拖拽或点击上传一个 `.fasta` 文件（或使用示例数据）

   - 选择分析模式（如 GC 含量）

   - 点击“开始分析”

   - 观察流式输出，等待完整报告

---

#### 6. 常见问题与解决

| 问题 | 原因 | 解决 |
|------|------|------|
| 上传后按钮仍禁用 | 文件未正确读取或类型检测失败 | 检查文件内容是否为空，或手动选择模式 |
| 点击分析无反应 | Worker 地址错误或网络不通 | 检查 `WORKER_URL` 是否包含 `https://`，用 `curl` 测试 |
| 流式输出中断 | 网络超时或 Worker 返回错误 | 查看浏览器 Console 错误，检查 Worker 日志 |
| 结果乱码 | 文件编码不是 UTF-8 | 确保文件为 UTF-8 编码，可用 `iconv` 转换 |
| 复制功能失效 | 浏览器安全策略 | 使用备用方法（手动选择文本 + Ctrl+C） |
| 每天 50 次限额 | OpenRouter 免费限制 | 充值 $10 提升至 1000 次/天，或合理分配课堂演示次数 |

---

#### 7. 用户体验优化建议（课后可以加）

- **添加进度条**：在分析过程中显示已接收的数据量
- **Markdown 渲染**：用 `marked.js` 渲染模型输出中的表格、标题、代码块，使报告更易读
- **历史记录**：将最近的分析结果保存在 `localStorage`，方便对比
- **导出为 PDF**：集成 `jspdf` 将报告导出为 PDF
- **多文件支持**：允许同时上传多个文件进行批量分析

---

#### 8. 本课核心代码速查

| 功能 | 代码片段 |
|------|----------|
| 文件读取 | `new FileReader().readAsText(file)` |
| 拖拽上传 | `dropzone.addEventListener('dragover', ...)` |
| 构建请求 | `fetch(WORKER_URL, { method:'POST', body: JSON.stringify(payload) })` |
| 流式读取 | `response.body.getReader()` + `TextDecoder` |
| 解析 SSE | `line.startsWith('data: ')` + `JSON.parse(payloadStr)` |
| 打字机效果 | 逐块追加内容 + `element.innerHTML` |
| 复制内容 | `navigator.clipboard.writeText(text)` |
| 下载文件 | `Blob` + `URL.createObjectURL` + `<a download>` |

---

#### 9. 课后练习

1. 修改前端样式，把上传区改成圆形拖拽区，并调整整体颜色主题。

2. 在分析结果中添加 Markdown 渲染（使用 `marked.parse()`），让输出包含标题、表格和代码块。

3. 增加一个“停止分析”按钮，中断正在进行的流式请求（利用 `AbortController`）。

4. 将 `resultArea` 的内容持久化到 `localStorage`，页面刷新后自动恢复历史报告。

5. 尝试上传一个真实的 PDB 文件（如 1TUP），检查模型能否正确识别结构信息。


### 第四课：数据解析与提示工程 —— 让 LLM 精准读懂生物文件

本课目标：

- 了解生物文件格式（FASTA / FASTQ / PDB）的核心信息结构

- 掌握提示工程的基本方法（角色、任务分解、输出格式约束）

- 为三种文件类型设计专用的系统提示词模板

- 实现文件内容预处理（提取关键信息、压缩长度、保留核心数据）

- 让模型输出结构化分析结果（Markdown 表格 + 关键指标）

- 优化模型输出，降低幻觉，提高专业准确性

---

#### 1. 生物文件格式速览（供提示词设计参考）

| 格式 | 核心结构 | 关键信息 | 分析重点 |
|------|----------|----------|----------|
| **FASTA** | `>header` + 序列（一行或多行） | 序列标题、字母（ATCG/U）、长度 | GC含量、序列复杂度、ORF预测、motif搜索 |
| **FASTQ** | `@header` + 序列 + `+` + 质量字符串 | 序列 + 质量分数（ASCII 编码） | 测序质量分布、覆盖度、变异检测 |
| **PDB** | 多行记录（ATOM, HETATM, HEADER, SEQRES, etc.） | 原子坐标、残基名、链标识、二级结构 | 分辨率、链数、二级结构组成、配体结合 |

**FASTA 示例**：

```
>BRCA1 human
ATGGATTTATCTGCTCTTCGCGTTGAAGAAGTACAAAATGTCATTAATGCTATGCAG...
```

**FASTQ 示例**：

```
@EAS139:136:FC706VJ:2:2104:15343:197393 1:Y:18:ATCACG
CTCAAGGTTGTTGCAAAGACGGGAGGTAGGTGCCTGGGCATTTTCC
+
CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC
```

**PDB 示例行**：

```
HEADER    HYDROLASE                               22-JAN-98   1TUP
ATOM      1  N   ASP A   1      32.371  76.442  59.599  1.00 63.52           N
ATOM      2  CA  ASP A   1      33.043  77.659  60.063  1.00 62.32           C
...
```

---

#### 2. 提示工程核心原则（专用于生物数据分析）

| 原则 | 说明 | 示例 |
|------|------|------|
| **角色设定** | 让模型扮演特定专家角色 | “你是一个生物信息学分析专家” |
| **任务分解** | 把复杂任务分成几步 | 先提取基本信息，再统计，最后解读 |
| **格式约束** | 明确要求输出格式（表格/列表/JSON） | “请用 Markdown 表格形式输出统计数据” |
| **关键词强制** | 要求模型必须包含某些关键指标 | “必须包括：序列长度、GC含量” |
| **引导推理** | 提供分析框架，引导模型思考 | “请按以下步骤分析：1.序列组成 2. 二级结构预测 3. 功能注释” |
| **示例引导（Few-shot）** | 在系统提示中给一个简要示例 | “例如：一个序列长度 1200bp，GC 含量 45% 属于正常范围” |
| **约束范围** | 限制模型不要回答无关内容 | “只基于提供的文件内容分析，不额外编造数据” |

---

#### 3. 专用提示词模板（可直接嵌入 Worker 或前端）

**FASTA 通用分析模板**：

```text
你是一个生物信息学分析专家。用户上传了一个 FASTA 文件，包含一条或多条核酸或蛋白质序列。

请按以下步骤输出分析报告：

1. **序列基本信息**
   - 序列数量
   - 每条序列的 ID 和长度
   - 序列类型（DNA/RNA/蛋白质）

2. **碱基/氨基酸组成统计**
   - 对于核酸序列：A、T、C、G 的含量百分比
   - 对于蛋白质序列：20 种氨基酸的分布
   - 计算 GC 含量（若为核酸）

3. **序列特征分析**
   - 是否存在明显重复序列或低复杂度区域
   - 若为 DNA：预测开放阅读框（ORF）或提示潜在编码区
   - 若为蛋白质：提示可能的保守结构域（基于序列模式）

4. **结论与建议**
   - 序列是否完整（是否有起始/终止密码子提示）
   - 可能的生物学功能（基于序列相似性，若可推断）

输出格式要求：
- 使用 Markdown 表格展示统计数据
- 使用项目符号列表展示结论
- 数字保留两位小数
- 不要编造数据，仅基于文件内容进行分析
```

**FASTQ 专用分析模板（侧重测序质量）**：

```text
你是一个生物信息学测序数据分析专家。用户上传了一个 FASTQ 文件。

请分析以下内容：

1. **测序基本信息**
   - 总 reads 数量
   - 每条 read 的长度（均匀度）
   - 序列类型（DNA/RNA）

2. **质量评估**
   - 平均质量得分（Q-score）分布
   - 质量低于 Q20 的 reads 占比
   - 是否存在质量下降趋势（从 5' 到 3'）

3. **GC 含量分布**
   - 所有 reads 的平均 GC 含量
   - GC 含量的变异度（是否有异常 reads）

4. **潜在问题提示**
   - 是否存在接头污染（若序列中出现常见接头序列）
   - 是否建议进行 trimming（基于质量分布）

输出格式要求：
- 用 Markdown 表格汇总统计指标
- 提供可视化描述（用文字描述质量曲线趋势）
- 给出具体的处理建议（如“建议使用 Trimmomatic 截断前 10bp”）
```

**PDB 专用分析模板（侧重结构）**：

```text
你是一个结构生物信息学专家。用户上传了一个 PDB 文件（三维结构）。

请分析以下内容：

1. **结构基本信息**
   - PDB ID（若存在 HEADER 行）
   - 分辨率（若存在）
   - 实验方法（X-ray / NMR / CryoEM）
   - 链的数量和每条链的残基数

2. **二级结构组成**
   - α-螺旋、β-折叠、转角、无规卷曲的大致比例
   - 请根据原子坐标的二级结构注释（若有）或根据序列推断

3. **配体与功能位点**
   - 是否存在非标准残基（配体、离子、水分子）
   - 列出主要的配体名称（如 HEM, ATP, ZN）

4. **结构质量评估**
   - 是否存在异常原子（B-factor 过高等）
   - 是否有缺失残基（间隙）

输出格式要求：
- 提供关键数据表格
- 简要总结结构的稳定性和功能可解释性
```

---

#### 4. 提示词工程实现（Worker 集成）

在 Worker 代码的 `buildSystemPrompt` 函数中，根据文件类型动态选择模板：

```javascript
function buildSystemPrompt(fileType, mode, style, extraPrompt) {
    const role = '你是一个专业的生物信息学分析专家。';
    let task = '';

    const templates = {
        'fasta': `用户上传了一个 FASTA 文件，包含核酸或蛋白质序列。
请依次分析：1. 序列基本信息（ID、长度、类型）；2. 碱基/氨基酸组成统计（含 GC 含量）；3. 序列特征（重复区域、ORF 预测等）；4. 结论与建议。`,
        'fastq': `用户上传了一个 FASTQ 文件（测序数据）。
请分析：1. 测序基本信息（reads 数、长度）；2. 质量评估（Q-score 分布）；3. GC 含量分布；4. 潜在问题提示。`,
        'pdb': `用户上传了一个 PDB 文件（三维结构）。
请分析：1. 结构基本信息（ID、分辨率、链数）；2. 二级结构组成；3. 配体与功能位点；4. 结构质量评估。`
    };

    task = templates[fileType] || templates['fasta'];

    let styleInstruction = '';
    if (style === 'detailed') {
        styleInstruction = '请提供详细的分析报告，包括数据来源、方法、结果和讨论，使用专业术语并适当引用标准。';
    } else {
        styleInstruction = '请提供简洁清晰的结论，突出关键指标，避免冗长解释。';
    }

    const formatInstruction = `
输出格式要求：
- 使用 Markdown 表格展示统计数据
- 使用项目符号列表展示结论
- 数字保留两位小数
- 不要编造数据，仅基于提供的文件内容进行分析
- 若无法确定某项，请注明“无法从文件内容推断”`;

    const extraInstruction = extraPrompt ? `\n额外指令：${extraPrompt}` : '';

    return `${role}\n${task}\n${styleInstruction}\n${formatInstruction}${extraInstruction}`;
}
```

---

#### 5. 文件内容预处理（确保不超上下文窗口）

Nemotron-3.5 Lightning 上下文窗口达 100 万 Token，对于大多数 FASTA/FASTQ 文件（几 MB 内）通常足够。但对于超大文件（如数 GB 的 FASTQ），需要截断或抽样。

**Worker 中的预处理策略**：

```javascript
function preprocessFileContent(content, fileType, maxChars = 50000) {
    // 如果内容长度小于限制，直接返回
    if (content.length <= maxChars) return content;

    // 对于 FASTA：保留前 N 条序列
    if (fileType === 'fasta') {
        const lines = content.split('\n');
        let kept = [];
        let seqCount = 0;
        let charCount = 0;
        let isHeader = false;
        for (const line of lines) {
            if (line.startsWith('>')) {
                if (seqCount > 10) break; // 最多保留 10 条序列
                seqCount++;
                isHeader = true;
            }
            kept.push(line);
            charCount += line.length;
            if (charCount > maxChars) break;
        }
        kept.push('\n... (文件内容过长，已截断，仅显示前 10 条序列)');
        return kept.join('\n');
    }

    // 对于 FASTQ：保留前 N 个 reads
    if (fileType === 'fastq') {
        const lines = content.split('\n');
        let kept = [];
        let readCount = 0;
        let charCount = 0;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('@')) {
                if (readCount >= 50) break; // 最多 50 条 reads
                readCount++;
            }
            kept.push(lines[i]);
            charCount += lines[i].length;
            if (charCount > maxChars) break;
        }
        kept.push('\n... (文件内容过长，已截断，仅显示前 50 条 reads)');
        return kept.join('\n');
    }

    // 对于 PDB：保留原子记录（ATOM/HETATM）的有限行
    if (fileType === 'pdb') {
        const lines = content.split('\n');
        let kept = [];
        let atomCount = 0;
        for (const line of lines) {
            if (line.startsWith('ATOM') || line.startsWith('HETATM')) {
                if (atomCount > 5000) break; // 最多 5000 个原子
                atomCount++;
            }
            kept.push(line);
            if (kept.length > 10000) break; // 总行数限制
        }
        kept.push('\n... (文件过长，已截断，仅保留前 5000 个原子记录)');
        return kept.join('\n');
    }

    // 默认直接截断
    return content.slice(0, maxChars) + '\n... (内容过长，已截断)';
}
```

在 Worker 的 `fetch` 处理中，调用此函数对 `file_content` 进行预处理。

---

#### 6. 增强分析指令：指定输出格式（JSON 可选）

为了便于前端解析，可以要求模型输出 JSON 格式（前端再渲染）。但为简单起见，本教程使用 Markdown 文本，利用 `marked.js` 在前端渲染表格和标题，获得良好的视觉体验。

如果需要结构化数据（如用于后续自动处理），可在提示词中要求模型输出 JSON 并指定字段。示例：

```text
请以 JSON 格式返回以下字段：
{
  "sequence_count": 整数,
  "total_length": 整数,
  "gc_content": 浮点数,
  "analysis_summary": "字符串"
}
```

模型会输出 JSON 文本，前端可直接 `JSON.parse()`。

---

#### 7. 提示词优化实战（减少幻觉）

| 技术 | 实现方式 |
|------|----------|
| **明确限制范围** | “只基于你从文件内容中获取的信息，不引用外部数据库” |
| **要求标注不确定项** | “如果某个统计量无法从文件内容确定，请注明‘无法确定’” |
| **提供单位** | “GC 含量以百分比形式输出，保留两位小数” |
| **分步引导** | 将分析任务拆分为多个子任务，逐步输出，降低错误累积 |
| **要求自我检查** | “在输出前，检查所有数值是否合理（如 GC% 在 0-100 之间）” |

---

#### 8. 完整 Worker 中的提示词组装流程

```javascript
// 在 Worker 的 fetch 处理中
const { messages, file_content, file_type, mode, style, custom_prompt } = requestBody;

// 预处理文件内容
const processedContent = preprocessFileContent(file_content, file_type);

// 构建系统提示词
const systemPrompt = buildSystemPrompt(file_type, mode, style, custom_prompt);

// 构造最终消息（含系统提示 + 文件上下文）
const finalMessages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `以下是要分析的文件内容：\n${processedContent}` }
];

// 转发给 OpenRouter
const openrouterPayload = {
    model: env.OPENROUTER_MODEL || 'nvidia/nemotron-3.5-lightning:free',
    messages: finalMessages,
    stream: true,
    max_tokens: 4096,
    temperature: 0.3
};
```

---

#### 9. 前端对 Markdown 输出的渲染增强

在前端 `index.html` 中，引入 `marked.js` 来渲染 Markdown 内容（已在第三课准备）：

```javascript
// 在流式接收完完整文本后，渲染 Markdown
const renderedHtml = marked.parse(resultText);
resultArea.innerHTML = `<div class="markdown-body">${renderedHtml}</div>`;
```

并添加一个 CSS 类美化 Markdown 表格（Bootstrap 自带表格样式可配合）：

```css
.markdown-body table { width: 100%; border-collapse: collapse; margin: 10px 0; }
.markdown-body th, .markdown-body td { border: 1px solid #ddd; padding: 6px; text-align: left; }
.markdown-body th { background: #f2f2f2; }
```

---

#### 10. 常见问题与解决

| 问题 | 原因 | 解决 |
|------|------|------|
| 模型回答过于泛泛 | 提示词不够具体 | 细化任务分解，要求分点回答 |
| 输出包含虚构数据 | 模型“编造” | 在提示词中强调“仅基于文件内容” |
| 表格格式错乱 | Markdown 表格不规范 | 在提示词中明确“表格需包含表头对齐符号 `|---|---|`” |
| 文件内容被截断影响分析 | 截断丢失关键信息 | 增加 `maxChars` 值，或抽样策略更智能 |
| 模型未按指定格式输出 | 格式约束不严格 | 在提示词中多次强调格式要求，甚至给出示例 |
| 输出太长导致前端卡顿 | 大量 Token 渲染 | 限制 `max_tokens` 为 4096，或使用流式逐步渲染 |

---

#### 11. 本课核心代码速查

| 功能 | 代码/模板 |
|------|-----------|
| 构建系统提示词 | `buildSystemPrompt(fileType, mode, style, extra)` |
| 文件内容预处理 | `preprocessFileContent(content, fileType, maxChars)` |
| 提示词模板（FASTA） | 见上文 |
| 提示词模板（FASTQ） | 见上文 |
| 提示词模板（PDB） | 见上文 |
| 前端 Markdown 渲染 | `marked.parse(resultText)` |

---

#### 12. 课后练习

1. 修改 `buildSystemPrompt` 函数，为 FASTA 文件增加“预测 ORF”的提示，让模型尝试找到最长开放阅读框。

2. 为 FASTQ 提示词增加“计算平均质量值”的明确要求，并让模型用表格列出 Q20/Q30 比例。

3. 在 Worker 的预处理函数中，增加对 PDB 文件“提取链标识”的简单解析，并将链标识列表传递给模型。

4. 测试不同温度参数（0.1, 0.5, 0.9）对分析结果稳定性的影响，并总结最佳值。

5. 尝试让模型输出 JSON 格式的分析报告，并在前端解析后以卡片形式展示关键指标（而非纯 Markdown）。



### 第五课：最终整合与上线 —— 错误处理、性能优化、用户体验增强

本课目标：

- 完善错误处理机制（网络异常、超时、频率限制、文件解析异常）

- 优化性能（前端缓存、请求防抖、加载状态细化）

- 增强用户体验（进度指示、断线重连、历史记录）

- 完整部署到 GitHub Pages + Cloudflare Worker

- 编写项目文档（README.md、使用说明）

- 最终验收测试清单

---

#### 1. 错误处理全栈设计（前端 + Worker）

错误处理分为三层：**前端捕获**（用户友好提示）、**Worker 捕获**（日志记录）、**OpenRouter 捕获**（API 错误转发）。

**前端错误处理增强（在 `index.html` 的 `analyzeBtn` 点击事件中）**：

```javascript
// 在 try 块外层添加超时控制
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 秒超时

try {
    const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
        let errMsg = `请求失败 (${response.status})`;
        try {
            const errData = await response.json();
            errMsg = errData.error || errMsg;
            // 特殊处理频率限制
            if (response.status === 429) {
                errMsg = '⚠️ 今日免费次数已用完 (50次/天)，请充值或明日再试';
            }
        } catch (e) {}
        throw new Error(errMsg);
    }
    // ... 正常流式读取
} catch (error) {
    if (error.name === 'AbortError') {
        resultArea.innerHTML = '<div class="alert alert-warning">⏱️ 请求超时（2分钟），请检查网络后重试</div>';
    } else {
        resultArea.innerHTML = `<div class="alert alert-danger">❌ ${error.message}</div>`;
    }
} finally {
    clearTimeout(timeoutId);
    // 恢复按钮状态
}
```

**Worker 错误处理增强（在 Worker 代码中）**：

```javascript
// 在 Worker 的 fetch 函数中，增加更细致的错误分类
try {
    const openrouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { ... },
        body: JSON.stringify(openrouterPayload)
    });

    if (!openrouterResponse.ok) {
        const errorText = await openrouterResponse.text();
        let statusMessage = '';
        switch (openrouterResponse.status) {
            case 401:
                statusMessage = 'API Key 无效或已过期';
                break;
            case 429:
                statusMessage = '频率限制 (免费模型 50次/天)';
                break;
            case 402:
                statusMessage = '账户余额不足，需充值';
                break;
            default:
                statusMessage = `OpenRouter 错误 (${openrouterResponse.status})`;
        }
        return new Response(JSON.stringify({
            error: statusMessage,
            detail: errorText
        }), {
            status: openrouterResponse.status,
            headers: { 'Content-Type': 'application/json', ...corsHeaders() }
        });
    }
    // ... 正常处理
} catch (error) {
    return new Response(JSON.stringify({
        error: 'Worker 内部错误',
        detail: error.message
    }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
}
```

---

#### 2. 性能优化策略

| 优化点 | 实现方式 | 效果 |
|--------|----------|------|
| **文件读取防抖** | 上传后延迟 300ms 再启用按钮 | 防止快速重复上传触发多次解析 |
| **结果缓存** | 将分析结果存入 `localStorage`，相同文件不重复分析 | 节省 API 调用次数 |
| **请求取消** | 使用 `AbortController` 实现“停止分析”功能 | 用户可随时中断 |
| **懒加载 Markdown** | 仅在需要时加载 `marked.js` | 减少首屏加载时间 |
| **Worker 响应压缩** | Worker 返回时启用 `gzip` 压缩 | 减少传输数据量 |

**结果缓存示例（前端）**：

```javascript
const CACHE_KEY = 'bio_analysis_cache';
function getCachedResult(fileContent) {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const hash = simpleHash(fileContent.slice(0, 1000)); // 用内容前缀做简易 key
    return cache[hash] || null;
}
function saveCache(fileContent, result) {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const hash = simpleHash(fileContent.slice(0, 1000));
    cache[hash] = { result, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
    }
    return 'h' + Math.abs(hash).toString(36);
}
```

---

#### 3. 用户体验增强（移动端适配 + 操作反馈）

**增加“停止分析”按钮**：

```html
<button id="stopBtn" class="btn btn-danger w-100 mt-2" style="display:none;">
    <i class="bi bi-stop-circle"></i> 停止分析
</button>
```

```javascript
let abortController = null;

// 在点击分析时创建
abortController = new AbortController();
document.getElementById('stopBtn').style.display = 'block';

// 停止按钮事件
document.getElementById('stopBtn').addEventListener('click', () => {
    if (abortController) {
        abortController.abort();
        resultArea.innerHTML += '\n\n⚠️ 分析已中断';
        document.getElementById('stopBtn').style.display = 'none';
    }
});
```

**文件上传进度显示**：

```javascript
// 在 FileReader 的 onprogress 事件中（需使用 FileReader 的 progress 事件）
reader.onprogress = function(e) {
    if (e.lengthComputable) {
        const pct = (e.loaded / e.total * 100).toFixed(0);
        fileInfo.textContent = `读取中... ${pct}%`;
    }
};
```

**移动端触摸优化**：

- 按钮尺寸 ≥ 44px（Bootstrap 默认满足）
- 上传区支持点击和触摸（已实现）
- 结果区可滑动（`overflow-y: auto`）

---

#### 4. 部署最终检查清单（上线前逐项确认）

| 检查项 | 状态 | 备注 |
|--------|------|------|
| Worker 中 `OPENROUTER_API_KEY` 已设置 | ☐ | Settings → Variables |
| Worker 代码已保存并部署 | ☐ | 确认版本最新 |
| `index.html` 中 `WORKER_URL` 已替换 | ☐ | 必须是你的 Worker 地址 |
| GitHub Pages 已启用 | ☐ | Settings → Pages → main 分支 |
| `index.html` 已推送到 GitHub | ☐ | 确认文件在根目录 |
| 浏览器访问 Pages 地址能加载页面 | ☐ | 无 404 错误 |
| 上传一个示例 FASTA 能正常分析 | ☐ | 测试流式输出 |
| 错误情况（无文件、大文件、网络断开）有提示 | ☐ | 用户友好 |
| 移动端打开页面布局正常 | ☐ | 用手机测试或 Chrome 模拟 |

---

#### 5. 项目文档（README.md 模板）

在 GitHub 仓库根目录创建 `README.md`：

```markdown
# 🧬 BioLLM Analyzer

基于 Cloudflare Worker + OpenRouter + GitHub Pages 的生物数据智能分析工具。

## 功能

- 支持 FASTA / FASTQ / PDB 文件上传
- AI 自动生成序列/结构分析报告
- 流式输出，逐字显示分析过程
- 响应式设计，支持手机/平板/电脑

## 技术栈

- **前端**：HTML5 + CSS3 + JavaScript (ES6) + Bootstrap 5
- **后端**：Cloudflare Workers (JavaScript)
- **LLM API**：OpenRouter (NVIDIA Nemotron-3.5 Lightning Free)
- **部署**：GitHub Pages + Cloudflare Workers

## 快速开始

1. Fork 本仓库
2. 在 Cloudflare 创建 Worker，设置环境变量 `OPENROUTER_API_KEY`
3. 修改 `index.html` 中的 `WORKER_URL` 为你的 Worker 地址
4. 启用 GitHub Pages

## 使用示例

上传一个 FASTA 文件 → 选择分析模式 → 点击“开始分析” → 等待流式输出

## 许可证

MIT License

## 作者

[你的名字] — [你的 GitHub]
```

---

#### 6. 最终验收测试（手动测试脚本）

在浏览器 Console 中运行以下代码，快速验证 Worker 连通性：

```javascript
fetch('https://bio-llm-api.你的用户名.workers.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        messages: [{ role: 'user', content: '测试连接' }],
        stream: false
    })
})
.then(r => r.json())
.then(data => console.log('Worker 连通成功:', data))
.catch(e => console.error('Worker 连通失败:', e));
```

预期输出：一个包含 `choices` 数组的 JSON 对象。

---

#### 7. 性能与成本监控

| 监控项 | 实现方式 |
|--------|----------|
| 每日调用次数 | OpenRouter 仪表盘查看 |
| 平均响应时间 | Worker 日志中记录 `Date.now()` 差值 |
| Token 消耗 | 从 OpenRouter 响应中提取 `usage` 字段 |
| 错误率 | Worker 中捕获异常并记录到日志服务（如 Cloudflare Analytics） |

**Worker 中添加简单的请求计时日志**：

```javascript
const startTime = Date.now();
// ... 处理请求 ...
console.log(`Request processed in ${Date.now() - startTime}ms`);
```

---

#### 8. 本课核心命令速查表（部署相关）

| 操作 | 命令/步骤 |
|------|-----------|
| 部署 Worker | Cloudflare Dashboard → 保存并部署 |
| 更新 GitHub Pages | `git add . && git commit -m "update" && git push` |
| 清除浏览器缓存 | `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac) |
| 查看 Worker 日志 | Cloudflare Dashboard → Workers → 点击 Worker → Logs |
| 测试 API 连通性 | `curl -X POST https://bio-llm-api.xxx.workers.dev -d '{"messages":[{"role":"user","content":"hi"}]}'` |

---

#### 9. 常见上线后问题及解决

| 问题 | 原因 | 解决 |
|------|------|------|
| 页面加载但上传按钮无效 | 浏览器安全策略限制本地文件 | 通过 GitHub Pages 访问，不要直接双击打开 `index.html` |
| Worker 返回 500 | 环境变量缺失或代码错误 | 检查 `OPENROUTER_API_KEY` 是否设置，查看 Worker Logs |
| 流式输出卡顿 | 网络带宽限制 | 降低 `max_tokens` 或提示用户等待 |
| 分析结果与预期不符 | 提示词设计问题 | 调整系统提示词模板，增加更具体的指令 |
| 每日 50 次限额快速耗尽 | 测试频繁 | 开发测试用本地模拟，生产再调用 API |

---

#### 10. 本课小结

- **错误处理**：前端超时控制 + Worker 状态码分类 + 用户友好提示
- **性能优化**：缓存机制 + 请求取消 + 懒加载
- **用户体验**：停止按钮 + 进度显示 + 移动端适配
- **部署**：确认环境变量、Worker 地址、Pages 配置
- **文档**：README.md 是项目的名片，必须完整
- **监控**：追踪调用量、响应时间、错误率，持续优化

---

#### 11. 附录 7 完整技术栈回顾

| 层级 | 技术 | 作用 |
|------|------|------|
| **前端** | HTML/CSS/JS + Bootstrap 5 | 用户界面与文件交互 |
| **后端** | Cloudflare Workers | 代理转发 + 安全隔离 |
| **LLM API** | OpenRouter + Nemotron-3.5 | 智能分析引擎 |
| **部署** | GitHub Pages | 静态托管 |
| **监控** | Cloudflare Logs | 运行状态追踪 |

---

#### 12. 课后练习（最终项目验收）

1. 将整个项目（前端 HTML + Worker 代码）部署到你的 GitHub 和 Cloudflare，生成可访问的线上地址。

2. 找一个真实的 FASTA 文件（如 BRCA1 序列），上传并观察分析结果，验证 GC 含量是否准确。

3. 尝试上传一个 PDB 文件（如 1TUP），检查模型能否正确识别链数和分辨率。

4. 故意输入一个格式错误的文件（如 `.txt`），验证前端是否给出正确的类型提示。

5. 打开浏览器的 Network 面板，观察流式输出的请求和响应，理解 SSE 的工作过程。

6. （选做）修改前端，增加“导出为 PDF”功能（使用 `jspdf` 库）。

---

## 附录 8：生物信息学实战工具补充（环境、文件格式、3D可视化与Git进阶）

本附录专门补充前七章遗漏但极为实用的**非理论性**内容，聚焦于环境配置、高频文件格式解析、前端3D结构展示以及版本控制实战技巧。

---

### 第一课：Conda / Mamba 环境管理（AidLux 与 Ubuntu 通用）

**为什么需要 Conda**：
- `apt` 中的生物软件版本往往过旧（如 samtools 0.1.x）
- 许多工具（如 `bwa`、`samtools`、`bcftools`）依赖特定编译环境
- Conda 能隔离不同项目的 Python/R 版本，避免依赖冲突

**在 AidLux / Ubuntu 上安装 Mambaforge（ARM64 兼容）**：

```bash
# 下载 ARM64 版本的 Mambaforge（适配 AidLux）
wget https://github.com/conda-forge/miniforge/releases/latest/download/Mambaforge-Linux-aarch64.sh
bash Mambaforge-Linux-aarch64.sh -b -p $HOME/mambaforge
echo 'export PATH="$HOME/mambaforge/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
mamba --version
```

**常用 Conda / Mamba 命令速查表**：

| 操作 | 命令 |
|------|------|
| 创建环境（指定 Python 版本） | `mamba create -n bio python=3.11 -y` |
| 激活环境 | `mamba activate bio` |
| 退出环境 | `mamba deactivate` |
| 安装生物信息学工具 | `mamba install -c bioconda samtools bwa bowtie2 -y` |
| 安装 Python 包 | `mamba install pandas numpy matplotlib -y` |
| 列出当前环境所有包 | `mamba list` |
| 删除环境 | `mamba env remove -n bio` |
| 导出环境为 YAML | `mamba env export > environment.yml` |
| 从 YAML 重建环境 | `mamba env create -f environment.yml` |

**实战：创建专用于附录 6 的序列分析环境**：

```bash
mamba create -n seq_analysis python=3.11 -y
mamba activate seq_analysis
mamba install -c bioconda samtools bcftools bedtools -y
mamba install biopython pandas -y
```

**在 AidLux 中使用 Conda 的注意事项**：

- AidLux 的存储空间有限，建议将 Conda 包缓存目录挂载到外部存储（如 `/sdcard`）：

```bash
mamba config --set pkgs_dirs /sdcard/conda_pkgs
```

---

### 第二课：高频生物文件格式解析（SAM/BAM / VCF / GFF/GTF）

#### 1. SAM/BAM（比对文件）

**SAM 的核心字段（11 列必选）**：

| 列号 | 字段名 | 说明 |
|------|--------|------|
| 1 | QNAME | 读段名称 |
| 2 | FLAG | 位标记（如 0=未配对，16=反向互补） |
| 3 | RNAME | 参考序列名（染色体） |
| 4 | POS | 比对起始位置（1-based） |
| 5 | MAPQ | 比对质量（Phred 分数） |
| 6 | CIGAR | 比对信息（如 100M、50S） |
| 7 | RNEXT | 配对读段的参考名 |
| 8 | PNEXT | 配对读段的位置 |
| 9 | TLEN | 插入片段长度 |
| 10 | SEQ | 序列 |
| 11 | QUAL | 质量字符串 |

**用 `pysam` 在 Python 中解析 BAM（轻量级）**：

```bash
mamba install -c bioconda pysam -y
```

```python
import pysam

# 读取 BAM 文件（索引 .bam.bai 需在同目录）
bamfile = pysam.AlignmentFile("sample.bam", "rb")

# 遍历前 10 条比对
for i, read in enumerate(bamfile):
    if i >= 10: break
    print(f"Read: {read.query_name}, Chr: {read.reference_name}, Pos: {read.reference_start + 1}, CIGAR: {read.cigarstring}")

# 统计比对率
total_reads = 0
mapped_reads = 0
for read in bamfile:
    total_reads += 1
    if not read.is_unmapped:
        mapped_reads += 1
print(f"比对率: {mapped_reads / total_reads * 100:.2f}%")

bamfile.close()
```

**纯 Python 解析 SAM（无额外依赖）**：

```python
def parse_sam_header(sam_file):
    """读取 SAM 头（@HD, @SQ 等）"""
    with open(sam_file, 'r') as f:
        for line in f:
            if line.startswith('@'):
                print(line.strip())
            else:
                break  # 头结束

parse_sam_header("sample.sam")
```

#### 2. VCF（变异检测文件）

**VCF 核心字段（8 列必选 + INFO/FORMAT）**：

| 列号 | 字段名 | 说明 |
|------|--------|------|
| 1 | CHROM | 染色体 |
| 2 | POS | 位置（1-based） |
| 3 | ID | rsID 或 . |
| 4 | REF | 参考碱基 |
| 5 | ALT | 变异碱基（逗号分隔多个） |
| 6 | QUAL | 质量分数 |
| 7 | FILTER | 过滤状态（PASS 或 .） |
| 8 | INFO | 附加信息（如 DP、AF） |

**使用 `vcfpy` 解析 VCF（推荐）**：

```bash
mamba install -c bioconda vcfpy -y
```

```python
import vcfpy

reader = vcfpy.Reader.from_path("sample.vcf")
print(f"样本数: {len(reader.samples)}")

for record in reader:
    # 只打印前 5 个突变
    if record.POS > 1000: break
    print(f"{record.CHROM}:{record.POS} REF:{record.REF} ALT:{','.join([str(a) for a in record.ALT])}")
    # 提取 INFO 中的等位基因频率
    af = record.INFO.get('AF', [None])[0]
    if af:
        print(f"  等位基因频率: {af}")
```

**纯 Python 快速解析 VCF（提取 SNP）**：

```python
def parse_vcf_simple(vcf_file):
    with open(vcf_file, 'r') as f:
        for line in f:
            if line.startswith('#'):
                continue
            parts = line.strip().split('\t')
            chrom, pos, ref, alt = parts[0], parts[1], parts[3], parts[4]
            if ref != alt and len(ref) == len(alt) == 1:
                print(f"SNP: {chrom}:{pos} {ref}->{alt}")

parse_vcf_simple("sample.vcf")
```

#### 3. GFF/GTF（基因组注释文件）

**GFF 的 9 列结构（GTF 类似但第 2 列和第 9 列格式有差异）**：

| 列号 | 字段名 | 说明 |
|------|--------|------|
| 1 | seqid | 序列 ID（染色体） |
| 2 | source | 数据来源（如 RefSeq） |
| 3 | type | 特征类型（gene, exon, CDS） |
| 4 | start | 起始位置（1-based） |
| 5 | end | 结束位置 |
| 6 | score | 得分或 . |
| 7 | strand | 链（+/-/.） |
| 8 | phase | 密码子相位（0/1/2） |
| 9 | attributes | 键值对（如 ID=gene1;Name=BRCA1） |

**用 Python 解析 GFF（提取基因和外显子）**：

```python
def parse_gff(gff_file):
    genes = {}
    with open(gff_file, 'r') as f:
        for line in f:
            if line.startswith('#'):
                continue
            parts = line.strip().split('\t')
            if len(parts) < 9:
                continue
            seqid, source, feat_type, start, end, score, strand, phase, attrs = parts
            start, end = int(start), int(end)
            # 提取 gene_id
            attr_dict = {}
            for attr in attrs.split(';'):
                if '=' in attr:
                    k, v = attr.split('=', 1)
                    attr_dict[k] = v
            gene_id = attr_dict.get('ID', attr_dict.get('gene_id', 'unknown'))
            if feat_type == 'gene':
                genes[gene_id] = {'chr': seqid, 'start': start, 'end': end, 'strand': strand, 'exons': []}
            elif feat_type == 'exon':
                if gene_id in genes:
                    genes[gene_id]['exons'].append((start, end))
    return genes

# 使用示例
ann = parse_gff("annotation.gff")
for gid, info in list(ann.items())[:3]:
    print(f"{gid}: {info['chr']}:{info['start']}-{info['end']} ({len(info['exons'])} exons)")
```

---

### 第三课：NGL Viewer —— 在网页中嵌入 3D 结构查看器

**NGL Viewer** 是一个纯 Web 的分子查看器，支持 PDB 和 mmCIF 格式，可直接嵌入附录 7 的前端项目。

**集成到 `index.html` 的步骤**：

1. 引入 NGL 库（CDN）：

```html
<!-- 在 <head> 或 <body> 末尾引入 -->
<script src="https://cdn.jsdelivr.net/npm/ngl@2.0.0/dist/ngl.js"></script>
```

2. 在 HTML 中添加容器：

```html
<div id="viewport" style="width: 100%; height: 400px; background: #1a1a2e; border-radius: 8px;"></div>
```

3. 在 JavaScript 中加载结构（支持 PDB ID、URL 或本地文件内容）：

```javascript
function loadStructure(containerId, data, format = 'pdb') {
    const stage = new NGL.Stage(containerId, { backgroundColor: '#1a1a2e' });
    
    // 方式1：从 PDB ID 加载（需联网）
    // stage.loadFile('rcsb://1TUP').then(function(comp) {
    //     comp.addRepresentation('cartoon');
    //     comp.autoView();
    // });

    // 方式2：从 Blob / URL 加载（适合用户上传的文件）
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    stage.loadFile(url, { ext: format }).then(function(comp) {
        // 添加卡通表示（蛋白质）
        comp.addRepresentation('cartoon', { color: 'residueindex' });
        // 添加原子球（配体）
        comp.addRepresentation('ball+stick', { sele: 'hetero' });
        comp.autoView();
    });
    return stage;
}

// 使用示例（假设从文件上传读取了 pdb_content）
// loadStructure('viewport', pdb_content, 'pdb');
```

**完整集成到附录 7 分析流程**：

- 用户上传 PDB 文件 → 前端预览文本 → 点击分析 → 在结果区 **同时** 显示 3D 结构 + AI 分析报告
- 布局建议：左侧占 60% 显示 NGL，右侧 40% 显示报告文本

**在 AidLux 本地测试**：由于 NGL 完全运行在浏览器中，不需要额外后端配置，适用于 Chromium 浏览器。

---

### 第四课：Git 进阶与 GitHub Actions 自动化

#### 1. 解决合并冲突（最常遇到的“拦路虎”）

**冲突标记解析**：

```text
<<<<<<< HEAD
你的修改
=======
别人的修改
>>>>>>> branch-name
```

**解决步骤**：
1. 打开冲突文件，搜索 `<<<<<<<`
2. 决定保留哪部分（或手动合并）
3. 删除 `<<<<<<<`、`=======`、`>>>>>>>` 标记
4. 保存文件
5. `git add 文件名`
6. `git commit -m "Resolved conflict"`

**使用 `git mergetool`（可视化工具辅助）**：

```bash
git mergetool  # 会打开 vimdiff 或配置的 GUI 工具
```

**避免冲突的最佳实践**：
- 频繁 `git pull`（至少每天一次）
- 开发新功能时切分支（`git checkout -b feature-xxx`），不要在主分支直接改
- 提交前先 `git stash` 暂存本地未提交的修改，拉取后再 `git stash pop`

#### 2. Git Stash（暂存临时修改）

| 操作 | 命令 |
|------|------|
| 暂存所有未提交修改 | `git stash` |
| 暂存并保留未跟踪文件 | `git stash -u` |
| 查看暂存列表 | `git stash list` |
| 恢复最近暂存（保留 stash） | `git stash apply` |
| 恢复并删除最近暂存 | `git stash pop` |
| 恢复指定 stash | `git stash apply stash@{1}` |
| 清空所有 stash | `git stash clear` |

#### 3. GitHub Actions 自动部署 Worker（CI/CD）

在仓库根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy Worker

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Wrangler
        run: npm install -g wrangler

      - name: Deploy Worker
        run: wrangler deploy --env production
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

**前置操作**：

1. 在 Cloudflare 生成 API Token（权限：Account Settings → API Tokens → Create Token → Edit Cloudflare Workers）
2. 在 GitHub 仓库 Settings → Secrets and variables → Actions 中添加：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

之后每次 `git push main`，Worker 都会自动重新部署。

#### 4. Git 撤销操作速查表（学生必背）

| 想做的事情 | 命令 |
|------------|------|
| 撤销 `git add`（移出暂存区） | `git reset HEAD 文件名` |
| 撤销最近一次 `commit`（保留修改） | `git reset --soft HEAD~1` |
| 撤销最近一次 `commit`（丢弃修改） | `git reset --hard HEAD~1` |
| 撤销所有本地未提交修改（危险） | `git checkout -- .` |
| 修改最后一次 commit 信息 | `git commit --amend -m "新消息"` |
| 回退到某个特定 commit（保留历史） | `git revert <commit-hash>` |

---

### 本附录核心速查表

| 主题 | 关键命令 / 代码 |
|------|----------------|
| Conda 安装 | `wget Mambaforge-Linux-aarch64.sh && bash` |
| Conda 创建环境 | `mamba create -n bio python=3.11` |
| 解析 BAM | `pysam.AlignmentFile("file.bam")` |
| 解析 VCF | `vcfpy.Reader.from_path("file.vcf")` |
| 解析 GFF | 用纯 Python 按行切分 `\t` |
| NGL 加载 | `new NGL.Stage('viewport')` + `loadFile(url)` |
| Git 冲突解决 | 手动删标记 + `git add + commit` |
| GitHub Actions | 写 `.yml` 文件 + 设置 Secrets |

---

### 课后练习

1. 在 AidLux 上用 Mamba 创建一个环境，安装 `samtools`，并用它查看一个 BAM 文件的头信息（`samtools view -H sample.bam`）。

2. 用 Python 解析任意一个 GTF 文件，统计每个染色体上的基因数量。

3. 在附录 7 的前端页面中嵌入 NGL Viewer，让用户上传 PDB 文件后自动显示 3D 结构。

4. 在你的 GitHub 仓库中模拟一次冲突：创建分支 `dev`，修改同一行代码并分别提交，然后合并，手动解决冲突。

5. 创建一个 GitHub Actions 工作流，每次 push 时自动在终端打印 "Deploying..."（无需实际部署，只验证流程）。
