# Static Neural Network

The idea for this project came to me when I was studying how the brain works. I realized that a network of neurons behaves a lot like nodes on a directed graph. They take signals in through their dendrites and, if triggered, they send out a signal through their axon.

![Neuron Anatomy](http://shajitheodore.com/wp-content/uploads/2015/09/Neuron.png)

When activated, a neuron fires a signal that transfers to all neurons downstream from itself, causing them to fire as well, if their action potential is reached. This triggers a chain reaction that propagates throughout the neural net, which, if structured properly, will self-perpetuate.

Neurons are obviously the information processing units of the body, so I decided to abstract their most important functionality and create an intuitive simulation of how they work. The ultimate goal of this simulation is to use some straightforward data structures and some simple one-way data-binding to perform relatively complex tasks that model basic brain behavior.


####One-Way Data-Binding

My goal with this project was to implement a form of one-way data-binding. A user would interact with the UI, either through the control panel, or through interacting with the neurons directly, and this would update the model.

This was reflected in the simulation instance, which itself contained a graph instance that stored the data separately from how to represent it on the screen.

This means that any interaction would result in a change in either the simulation variables or the graph data structure.

In the first case interaction would change the type of neuron, the functionality of the double click, or initiate the simulation.

In the latter case it would affect individual neurons and their state, or their connections.

These changes would then be fed into the jCanvas drawing functions that would visualize them to the screen.

![data flow](https://s8.postimg.org/vcndudnqt/Data_Flow.png)

(Requires an update to reflect data structure refactor)

####Data Structures
#####Nodes
I implemented a Node class that stores information about nodes that it is connected to, nodes that connect to it, that node's particular state, and a unique ID (integer) for that node.

Technically, an individual node would only need to know what nodes it connects to downstream. I added a reference to nodes upstream to improve the efficiency of deleting nodes and their connections. With the backwards reference the runtime is proportional to how many nodes a particular
node is connected (upstream and downstream), rather than the total number of nodes in the graph.

#####Graph

I implemented a Graph class that stored all the nodes, a unique ID counter for new nodes, and whether the graph was in the process of simulating.

It also had the CRUD methods for adding/connecting/activating nodes and their inverses, as well as for running the simulation.

####Space/Time Complexity

The runtime of the simulation is worst case O(n), which is an improvement on my previous iteration. Previously I was using an adjacency matrix and state vector to implement my graph, but found that to have a worst case of O(n^2).

There was a lot of redundant state checking and I found a way to optimize my code by using hash-tables. Because JS objects are passed around by reference, this also cuts the space complexity to O(n). The adjacency matrix solution had a best case of O(n^2).


####Future Plans

######More Output Node Types
One of the main features I'm planning to implement is a greater degree of abstraction are the kinds of **output nodes**. Currently the only special type of node is a spinner node, which, when it receives a signal will spin a predetermined amount. Ideally there would be several different kinds or even user customizable types of nodes, which could ultimately interact with one another in complex ways. The goal there is to abstractly simulate how our brain fires off signals that cause our muscles or organs to activate and perform a certain action.

######Signal Thresholds
One feature that will add a lot of complexity to the simulator and add a layer of realism is the ability for nodes to only activate if a given threshold is reached. This will be similar to how real neurons fire, where if a signal isn't strong enough, the neuron's action potential won't be reached, and it won't pass on the signal. This could be achieved with setting some kind of threshold property on the neuron: it would only activate if 2 or more signals hit it simultaneously.

This will also have the effect of making the neurons act like logic gates, though on a spectrum, where more sensitive neurons are closer to OR gates, and less sensitive ones are like AND gates.

######Saving/Loading Graphs
Something I'd like to add would be the ability load in or save graphs to share or work on them in the future. It will require a bit of a code refactor, building out the backend a lot more and creating a database.
