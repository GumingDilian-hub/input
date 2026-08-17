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
