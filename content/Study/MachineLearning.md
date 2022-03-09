---
title: Machine Learning
date: 2022-01-18
mathjax: true
publishdate: 2022-01-18
---

1. [Machine Learning Basics](#machine-learning-basics)
1. [Algorithms](#algorithms)
    1. [Problems](#problems)
2. [Model & Cost Function](#model--cost-function)
    1. [Cost Function Intuition I](#cost-function-intuition-i)
    2. [Cost Function - Intuition II](#cost-function---intuition-ii)
3. [Parameter Learning](#parameter-learning)
    1. [Gradient Descent](#gradient-descent)
    2. [Gradient Descent Intuition](#gradient-descent-intuition)
4. [Multiple Features](#multiple-features)
5. [Normal Equation](#normal-equation)

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

## Model & Cost Function

To describe the supervised learning problem slightly more formally, our goal is, given a training set, to learn a function h : X → Y so that h(x) is a “good” predictor for the corresponding value of y. For historical reasons, this function h is called a hypothesis. Seen pictorially, the process is therefore like this:

![Model Representation](/Images/ModelRepresentation.png "Model Representation")

We can measure the accuracy of our hypothesis function by using a cost function. This takes an average difference (actually a fancier version of an average) of all the results of the hypothesis with inputs from x's and the actual output y's.

![Cost Function](/Images/CostFunction.png "Cost Function")
This function is otherwise called the "Squared error function", or "Mean squared error". The mean is halved (1/2) as a convenience for the computation of the gradient descent, as the derivative term of the square function will cancel out the (1/2) term. The following image summarizes what the cost function does:

![Cost Function2](/Images/CostFunction2.png "Cost Function2")

### Cost Function Intuition I

![Cost Function Intuition 1](/Images/CostFunctionIntuition1.png "Cost Function Intuition 1")

![Cost Function Intuition 1b](/Images/CostFunctionIntuition1b.png "Cost Function Intuition 1b")

### Cost Function - Intuition II

A contour plot is a graph that contains many contour lines. A contour line of a two variable function has a constant value at all points of the same line. An example of such a graph is the one to the right below.

**Taking any color and going along the 'circle', one would expect to get the same value of the cost function**. For example, the three green points found on the green line above have the same value for J($\theta_0$ ,$\theta_1$) and as a result, they are found along the same line. The circled x displays the value of the cost function for the graph on the left when
$\theta_0$ = 800 and $\theta_1$ = -0.15. Taking another h(x) and plotting its contour plot, one gets the following graphs:
![Cost Function Intuition 2](/Images/CostFunctionIntuition2.png "Cost Function Intuition 2")

When $\theta_0$ = 360 $\theta_1$ = 0, the value of J($\theta_0$,$\theta_1$)J($\theta_0$,$\theta_1$) in the contour plot gets closer to the center thus reducing the cost function error. Now giving our hypothesis function a slightly positive slope results in a better fit of the data.

![Cost Function Intuition 2](/Images/CostFunctionIntuition2b.png "Cost Function Intuition 2")

![Cost Function Intuition 2](/Images/CostFunctionIntuition2c.png "Cost Function Intuition 2")

## Parameter Learning

### Gradient Descent

So we have our hypothesis function and we have a way of measuring how well it fits into the data. Now we need to estimate the parameters in the hypothesis function. That's where gradient descent comes in.

Imagine that we graph our hypothesis function based on its fields $\theta_0$ and $\theta_1$
(actually we are graphing the cost function as a function of the parameter estimates). We are not graphing x and y itself, but the parameter range of our hypothesis function and the cost resulting from selecting a particular set of parameters.

We put $\theta_0$ on the x axis and $\theta_1$
on the y axis, with the cost function on the vertical z axis. The points on our graph will be the result of the cost function using our hypothesis with those specific theta parameters. The graph below depicts such a setup.

![Gradient](/Images/Gradient1.png "Gradient")

We will know that we have succeeded when our cost function is at the very bottom of the pits in our graph, i.e. when its value is the minimum. The red arrows show the minimum points in the graph.

The way we do this is by taking the derivative (the tangential line to a function) of our cost function. The slope of the tangent is the derivative at that point and it will give us a direction to move towards. We make steps down the cost function in the direction with the steepest descent. The size of each step is determined by the parameter α, which is called the learning rate.

For example, the distance between each 'star' in the graph above represents a step determined by our parameter α. A smaller α would result in a smaller step and a larger α results in a larger step. The direction in which the step is taken is determined by the partial derivative of J($\theta_0$,$\theta_1$). Depending on where one starts on the graph, one could end up at different points. The image above shows us two different starting points that end up in two different places.

The gradient descent algorithm is:

repeat until convergence:

$\theta_j$ := $\theta_j$ - $\alpha$ $\frac{\partial}{\partial \theta_j}$ J($\theta_0$, $\theta_1$)

where j=0,1 represents the feature index number.

At each iteration j, one should simultaneously update the parameters $\theta_1$, $\theta_2$,...,$\theta_n$. Updating a specific parameter prior to calculating another one on the j$^{(th)}$
iteration would yield to a wrong implementation.

![Gradient](/Images/Gradient1b.png "Gradient")

### Gradient Descent Intuition

Let's simplify but optimizing only one dimension. One parameter.

Repeat until convergence:

$\theta_1$ := $\theta_1$ - $\frac{\partial}{\partial \theta_1}$ J($\theta_1$)

Regardless of the slope's sign for $\frac{d}{d \theta_1}$ J($\theta_1$),
$\theta_1$ eventually converges to its minimum value. The following graph shows that when the slope is negative, the value of $\theta_1$
increases and when it is positive, the value of $\theta_1$
decreases.

On a side note, we should adjust our parameter $\alpha$ to ensure that the gradient descent algorithm converges in a reasonable time. Failure to converge or too much time to obtain the minimum value imply that our step size is wrong.

The intuition behind the convergence is that $\frac{d}{d\theta_1}$ J($\theta_1$) approaches 0 as we approach the bottom of our convex function. At the minimum, the derivative will always be 0.

![Gradient](/Images/gradient2.png "Gradient")

![Gradient](/Images/gradient2b.png "Gradient")

**Gradient descent can converge to a local
minimum, even with the learning rate $\alpha$ fixed**

![Gradient](/Images/gradient2c.png "Gradient")

## Multiple Features

$x^{(i)}_j$ =value of feature j in the $i^{th}$ training example

$x^{(j)}$=the input (features) of the ith training example

m = the number of training examples

n =the number of features

$h_θ(x)=θ_0+θ_1x_1+θ_2x_2+⋯+θ_nx_n$
​

In order to develop intuition about this function, we can think about $\theta_0$ as the basic price of a house, $\theta_1$ as the price per square meter $θ_2$ as the price per floor, etc. $x_1$ will be the number of square meters in the house, $x_2$ the number of floors, etc.
Using the definition of matrix multiplication, our multivariable hypothesis function can be concisely represented as:

$hθ(x)=\begin{matrix}{[θ_0 θ_1 ... θn]}\end{matrix} \begin{bmatrix}
x_0\\
x_1\\
...\\
x_n
\end{bmatrix} = θ^Tx$

## Normal Equation

Gradient descent gives one way of minimizing J. Let’s discuss a second way of doing so, this time performing the minimization explicitly and without resorting to an iterative algorithm. In the "Normal Equation" method, we will minimize J by explicitly taking its derivatives with respect to the θj ’s, and setting them to zero. This allows us to find the optimum theta without iteration. The normal equation formula is given below:

$θ=(X^TX)^{−1}X^Ty$

There is no need to do feature scaling with the normal equation.

The following is a comparison of gradient descent and the normal equation:

|  Gradient Descent  | Normal Equation   |
|--- |--- |
|  Need to choose alpha  |  No need to choose alpha  |
|   Needs many iterations |  No need to iterate  |
|   $O (kn^2$) |   $O(n^3)$, need to calculate inverse of $X^TX$ |
|   Works well when n is large |  Slow if n is very large  |

With the normal equation, computing the inversion has complexity $\mathcal{O}(n^3)$. So if we have a very large number of features, the normal equation will be slow. In practice, when n exceeds 10,000 it might be a good time to go from a normal solution to an iterative process.
