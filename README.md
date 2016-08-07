# Static Neural Network

The idea for this project came to me when I was studying how the brain works. I realized that a network of neurons behaves a lot like nodes on a directed graph. They take signals in through their dendrites and, if triggered, they send out a signal through their axon.

![Neuron Anatomy](http://shajitheodore.com/wp-content/uploads/2015/09/Neuron.png)

When activated, a neuron fires a signal that transfers to all neurons downstream from itself, causing them to fire as well, if their action potential is reached. This triggers a chain reaction that propagates throughout the neural net, which, if structured properly, will self-perpetuate.

Neurons are obviously the information processing units of the body, so I decided to abstract their most important functionality and create an intuitive simulation of how they work. The ultimate goal of this simulation is to use some straightforward data structures and some simple one-way data-binding to perform relatively complex tasks that model basic brain behavior.

###The Data Structures

####Connectivity Matrix
A directed graph of **N** nodes can be represented by an **NxN** matrix, which I call a **connectivity matrix**. This matrix preserves the state of all the connections between the nodes in the graph. So graph below:

![example](https://s31.postimg.org/k3a2p9hnv/SNNexample.png)

becomes:

![matrix](https://s32.postimg.org/a4cnw4yp1/Connectivity_Matrix.png)

The **column number** represents the **origin node** of a connection, and the **row number** represents the **destination node** between a connection.

A **1** represents a connection between nodes, and a **0** represents no connection.

####State Vector

The other component is a called a **state vector**. This preserves the state of the nodes. It shows where the **signal** is in the network during a given interval, and it updates over time to show the signal moving throughout the network.

The data structure for **N** nodes is simply a vector of **N** elements. A **1** signifies an activated node, and a **0** is an inactivated node. for the example above the state vector would be:

![vector](https://s32.postimg.org/rsxopgos5/State_Vector.png)

####Moving Between States

Multiplying the connectivity matrix and the state vector together yields another vector which incidentally represents the following state of the simulation. Such that:

![update](https://s31.postimg.org/b4dm6ftff/Update_State.png)

####One-Way Data-Binding

My goal with this project was to implement a form of one-way data-binding. A user would interact with the UI, either through the control panel, or through interacting with the neurons directly, and this would update the model. This means that any interaction would result in a change in either the global variables that dictate the type of the neuron, or the functionality of double clicking, or a change in either the connectivity matrix or state vector.
This updated model would then feed back into the drawing functions, which in turn would affect the UI and what the user sees.

![data flow](https://s8.postimg.org/vcndudnqt/Data_Flow.png)

####Observations

The interesting thing about the connectivity matrix is that it allows different behaviors with the same connections between the neurons. This occurs because different state vectors will behave differently with the same connections. Starting with one active neuron is not the same as starting with 2 or 3 or more. And even with the same number of neurons, their relative positions on the graph can affect the behavior of it differently.

The runtime of the simulation is worst case O(n^2), which occurs when all the neurons are fully activated, and best case O(n), when only one neuron is active.

####Future Plans

######More Output Node Types
One of the main features I'm planning to implement is a greater degree of abstraction are the kinds of **output nodes**. Currently the only special type of node is a spinner node, which when it receives a signal will spin a predetermined amount. Ideally there would be several different kinds or even user customizable types of nodes, which could ultimately interact with one another in complex ways. The goal is to simulate how our brain fires off signals that cause our muscles or organs to activate.

######More Connection Node Types
One feature that will add a lot of complexity to the simulator and add a layer of realism is the ability for nodes to only activate if a given threshold is reached. This will be similar to how real neurons fire, where if a signal isn't strong enough, the neuron's action potential won't be reached, and it won't pass on the signal. This could be achieved with setting some kind of threshold property on the neuron: it would only activate if 2 or more signals hit it simultaneously. Or it could be set on the connectivity matrix, where different connections pass on signals with different strengths.

This will also have the effect of making the neurons act like logic gates, though on a spectrum, where more sensitive neurons are closer to OR gates, and less sensitive ones are like AND gates.

######Saving/Loading Graphs
Something I'd like to add would be the ability load in or save graphs to share or work on them in the future. It will require a bit of a code refactor and building out the back end more and creating a database.
