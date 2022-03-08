---
title: Machine Learning Exercises (Hands-On Machine Learning with Scikit-Learn and TensorFlow)
mathjax: true
draft: true
---

# Test Chapter 1

1. How would you define Machine Learning?
Teaching machine to come into conclusions based on data
2. Can you name four types of problems where it shines?
Prediction based on historical data (trends), clustering unlabeled data to figure out common features, predictions of feature based on other features (car prices), security - finding uncommon elements ?

3. What is a labeled training set?
Training set in supervised training with described characteristics of measured elements (?)

4. What are the two most common supervised tasks?
Classification - its good or bad
Prediction of numeric value

5. Can you name four common unsupervised tasks?
Clustering
Visualization
Dimensionality reduction (simplifying data without too loosing too much information)
Anomaly detection

6. What type of Machine Learning algorithm would you use to allow a robot to walk in various
unknown terrains?
Reinforcement Learning - awards for good behavior and penalties for bad

7. What type of algorithm would you use to segment your customers into multiple groups?
Clustering

8. Would you frame the problem of spam detection as a supervised learning problem or an
unsupervised learning problem?
Supervised
9. What is an online learning system?
It means the algorithm is learning on live data, stream or mini batches

10. What is out-of-core learning?
Online learning algorithms can also be used to train systems on huge datasets that cannot fit in one
machine’s main memory (this is called out-of-core learning). The algorithm loads part of the data, runs a
training step on that data, and repeats the process until it has run on all of the data

11. What type of learning algorithm relies on a similarity measure to make predictions?
Instance Based

12. What is the difference between a model parameter and a learning algorithm’s hyperparameter?
The amount of regularization to apply during learning can be controlled by a hyperparameter. A
hyperparameter is a parameter of a learning algorithm (not of the model). As such, it is not affected by the learning algorithm itself;
In classical machine learning literature, we may think of the model as the hypothesis and the parameters as the tailoring of the hypothesis to a specific set of data.
Often model parameters are estimated using an optimization algorithm, which is a type of efficient search through possible parameter values

13.  What do model-based learning algorithms search for? What is the most common strategy they use
to succeed? How do they make predictions?
Function (model) that is closely related to data and that can make predictions based on arguments?

14. Can you name four of the main challenges in Machine Learning?
Bad data ( too little, too much, irrelevant features, poor quality)
Bad algorithm
overfitting (generalization) / underfitting (too simple model to represent the complexity of real world)

15. If your model performs great on the training data but generalizes poorly to new instances, what is happening? Can you name three possible solutions?
Overfitting ?
Traing multiple models using different alhorithms, validate with test data, compare?

16.  What is a test set and why would you want to use it?
To validate the model

17. What is the purpose of a validation set?
Used to test the model

18. What can go wrong if you tune hyperparameters using the test set?
It can behave poorly with validation set, you always want to validate on validation test in the end.

19. What is cross-validation and why would you prefer it to a validation set?
Best explained here [Validation Set vs Cross-Validation etc](https://www.statology.org/validation-set-vs-test-set/#:~:text=In%20simple%20terms%2C%20the%20validation%20set%20is%20used,the%20model%20is%20applied%20to%20an%20unseen%20dataset.)
Long story short you split training set into multiple training and validation sets.
![Validation and Training Sets](/Images/ML/crossvalidationvsvalidationSet.png)