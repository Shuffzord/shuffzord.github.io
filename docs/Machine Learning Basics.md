# Machine Learning Basics

> A computer program is said to learn from **experience E** with respect to some **task T** and some **performance measure P**, if its performance on T as measured by P, improves with experience E

```Example: playing checkers.
E = the experience of playing many games of checkers
T = the task of playing checkers.
P = the probability that the program will win the next game
```

## Algorithms

- Supervised Learning
  We give the algorithm 'right answer' to learn
- Unsupervised learning
  Unsupervised learning allows us to approach problems with little or no idea what our results should look like. We can derive structure from data where we don't necessarily know the effect of the variables.
  We can derive this structure by clustering the data based on relationships among the variables in the data.
  With unsupervised learning there is no feedback based on the prediction results.

### Problems

- Regression: Predict continuous valued output
- Classification: Discrete valued output (0,1,...can be more options than two)

## Model Representation

To describe the supervised learning problem slightly more formally, our goal is, given a training set, to learn a function h : X → Y so that h(x) is a “good” predictor for the corresponding value of y. For historical reasons, this function h is called a hypothesis. Seen pictorially, the process is therefore like this:

![Model Representation](Images/ModelRepresentation.png "Model Representation")

## Cost Function

We can measure the accuracy of our hypothesis function by using a cost function. This takes an average difference (actually a fancier version of an average) of all the results of the hypothesis with inputs from x's and the actual output y's.

![Cost Function](Images/CostFunction.png "Cost Function")
This function is otherwise called the "Squared error function", or "Mean squared error". The mean is halved (1/2) as a convenience for the computation of the gradient descent, as the derivative term of the square function will cancel out the (1/2) term. The following image summarizes what the cost function does:

![Cost Function2](Images/CostFunction2.png "Cost Function2")

### Cost Function Intuition 1

![Cost Function Intuition 1](Images/CostFunctionIntuition1.png "Cost Function Intuition 1")

![Cost Function Intuition 1b](Images/CostFunctionIntuition1b.png "Cost Function Intuition 1b")
