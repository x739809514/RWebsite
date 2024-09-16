## HuggingFace 是什么
Hugging Face 是一家致力于自然语言处理（NLP）技术的公司，同时也是一个广受欢迎的开源社区平台。它提供了多种工具和库，帮助开发者和研究人员构建、训练和部署机器学习模型，特别是用于处理文本数据的模型。
- **🤗 Transformers 库**：这是 Hugging Face 最著名的库之一，提供了许多预训练的 Transformer 模型，例如 BERT、GPT、T5 等。它们可以用于各种 NLP 任务，如文本分类、生成、翻译、问答等。
- **🔧 Datasets 库**：这个库提供了大量预处理好的数据集，可以方便地用于训练和评估模型。它支持多种数据格式，并且可以轻松与 Transformers 库集成。
- **🛠️ Tokenizers 库**：用于处理文本数据的分词库，支持快速和高效的文本预处理。这对于处理大型数据集非常有用。
- **📦 Model Hub**：Hugging Face 提供了一个模型仓库，用户可以在上面发布和分享他们训练的模型，也可以从中下载他人分享的预训练模型。这个仓库包括了各种各样的模型，适用于不同的任务和语言。
- **🌐 Hub API**：Hugging Face 提供了一个简单易用的 API，可以直接在应用程序中使用预训练模型，进行推理和预测。
- **👥 社区和支持**：Hugging Face 拥有一个活跃的社区，用户可以在论坛、GitHub 和其他平台上互相交流和分享经验。

### 使用案例（一）

定义一个task,然后从开源社区中把model的名字拷贝下来使用
```python
#%% packages
from transformers import pipeline

# %% only provide task
pipe = pipeline(task="text-classification")
# %% run pipe
pipe("I like it very much.")
# %% provide model
pipe = pipeline(task="text-classification",
                model="nlptown/bert-base-multilingual-uncased-sentiment")
# %% run pipe
# consume just a string
pipe("I like it very much.")
# %% consume a list
pipe(["I like it very much.", "I hate it."])
```
`pipeline` 函数会根据你指定的任务自动加载合适的预训练模型和分词器。你只需提供任务名称和输入文本即可，这里使用pipeline加载了一个情感分析的模型，最后会通过star的个数来表示情感极性。
```
[{'label': '5 stars', 'score': 0.5000861883163452}]

[
{'label': '5 stars', 'score': 0.5000861883163452}, 
{'label': '1 star', 'score': 0.7190805077552795}
]
```

### 使用案例（二）

```python
#%% packages
from transformers import pipeline

# %% Named Entity Recognition
pipe = pipeline(task="ner")
pipe("Apple Inc. was founded by Steve Jobs, Steve Wozniak, and Ronald Wayne on April 1, 1976, in Cupertino, California.")
```
`ner`模型可以对词性进行分类
```
[{'entity': 'I-ORG',
  'score': 0.99959284,
  'index': 1,
  'word': 'Apple',
  'start': 0,
  'end': 5},
 {'entity': 'I-ORG',
  'score': 0.9994708,
  'index': 2,
  'word': 'Inc',
  'start': 6,
  'end': 9},
 {'entity': 'I-PER',
  'score': 0.9993297,
  'index': 7,
  'word': 'Steve',
  'start': 26,
  'end': 31},
 ......
 {'entity': 'I-LOC',
  'score': 0.998528,
  'index': 31,
  'word': 'California',
  'start': 102,
  'end': 112}]
```

### 使用案例（三）

```python
#%% packages
from transformers import pipeline

# %% Question Answering
pipe = pipeline("question-answering")
pipe(context="The Big Apple is a nickname for New York City.", question="What is the Big Apple?")
```
问答模型，output：
```
{
 'score': 0.6228488683700562,
 'start': 17,
 'end': 45,
 'answer': 'a nickname for New York City'
 }
```
## Zero-Shot Classification

Zero-shot classification 是一种机器学习技术，它允许模型在没有针对特定任务进行训练的情况下，对未见过的类别进行分类。这种方法依赖于模型的泛化能力，使其能够处理新类别的输入，并推断出输入与这些新类别的关系。
### 主要特点：

- **无需特定类别训练**: 传统的分类模型需要在训练时明确地针对每个类别进行学习，而 zero-shot classification 则不需要对特定类别进行训练。模型通过理解任务的描述或类别的语义信息，能够处理新的类别。
- **灵活性**: 由于模型不局限于预先定义的类别，zero-shot classification 提供了极大的灵活性，适用于需要动态处理不同类别的应用场景。
### 工作原理：

Zero-shot classification 的核心在于模型如何理解输入和类别之间的关系。通常，这类模型会利用预训练的语言模型，如 BERT、GPT 等，这些模型具备强大的语义理解能力。以下是零样本分类的基本工作流程：
1. **输入文本**: 用户提供一个文本或句子，模型需要对此进行分类。
2. **类别标签**: 用户提供一组类别标签（可以是几个单词或一个描述性短语），这些类别标签可能是模型在训练中未见过的。
3. **语义匹配**: 模型将输入文本与每个类别标签进行语义匹配，计算它们之间的相似性。
4. **概率输出**: 模型输出每个类别的概率分布，表示输入文本属于各个类别的可能性。
```python
#%% packages
from transformers import pipeline
import pandas as pd

#%% Classifier
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
 # %% Data Preparation
# first example: Raymond Chandler "The Big Sleep" (crime novel)
# second example: J.R.R. Tolkien "The Lord of the Rings" (fantasy novel)
# third example: Bill Bryson "A Short History of Nearly Everything"

documents = ["It was about eleven o’clock in the morning, mid October, with the sun not shining and a look of hard wet rain in the clearness of the foothills. I was wearing my powder-blue suit, with dark blue shirt, tie and display handkerchief, black brogues, black wool socks with dark blue clocks on them. I was neat, clean, shaved and sober, and I didn’t care who knew it. I was everything the well-dressed private detective ought to be. I was calling on four million dollars.",

             "When Mr. Bilbo Baggins of Bag End announced that he would shortly be celebrating his eleventy-first birthday with a party of special magnificence, there was much talk and excitement in Hobbiton.",

             "Welcome. And congratulations. I am delighted that you could make it. Getting here wasn’t easy, I know. In fact, I suspect it was a little tougher than you realize. To begin with, for you to be here now trillions of drifting atoms had somehow to assemble in an intricate and curiously obliging manner to create you. It’s an arrangement so specialized and particular that it has never been tried before and will only exist this once."
             ]

candidate_labels=["history", "crime", "fantasy"]

#%% classify documents, 同时把参数也传入进去
res = classifier(documents, candidate_labels = candidate_labels)

#%% visualize results
pd.DataFrame(res[1]).plot.bar(x='labels', y='scores', title='Lord of the Rings')

# %% flag multiple labels
classifier(documents[0], candidate_labels = candidate_labels, multi_label=False)
```