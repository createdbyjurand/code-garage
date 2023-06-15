# Frotend Interview Questions

## Table of Contents

- Virtual DOM
- React.lazy
- Null == undefined
- Promise (definition)

## Weak sides

- Next.js
- React Keys
- FLOW
- JS types
- typeOf null
- Reconciliation
- React hooks
- useCallback
- PureComponent
- React.memo
- Class Component Static Methods
- Promise static methods
- Boundary Component
- React.createPortal
- Redux, is it async?
- Redux, why do we need middleware?
- Closure

## What to impove

### Next.js

- Next.js is an open-source web development framework created by Vercel enabling React-based web applications with server-side rendering and generating static websites.
- Google has contributed to the Next.js project, contributing 43 pull requests in 2019, where they helped in pruning unused JavaScript, reducing loading time, and adding improved metrics.

### React JSX

- JavaScript and XML
- Syntactic sugar over React.createElement("div", null, "Hello ", this.props.name);
- React under the hood is just creating elements.

### Why is class, classname in React?

- class is a reserved keywork in JavaScript, and JSX is compiled down do JavaScript so it would cause conflict, so that is why in JSX class is named classname.
- under the hood Babel is creating compilation.

### Describe data flow in React

- data flow is unidirectional

### How would you delay an API call untill a component has mounted

- componentDidMount() in class (a function that runs after the component has mounted)
- useEffect hook and pass the empty array (mimics the coumponent did mount)

### Should you use ternaries or && operator to conditionaly render react components

- ternaries yes (condition ? exprIfTrue : exprIfFalse)
- && operator has bugs when it gets for example 0 because we are checking the length of an array, it doesn't bother to evaluate right side because it knows that 0 and something is always falsy, and what happens it 0 is being rednered to the page

### render props

### write your own hook

### HOC

```javascript
// accept a Component as an argument
const withSomeLogic = Component => {
  // do something

  // return a component that renders the component from the argument
  return props => <Component {...props} />;
};

const Button = ({ onClick }) => <button onClick={func}>Button</button>;
const ButtonWithSomeLogic = withSomeLogic(Button);

const SomePage = () => {
  return (
    <>
      <Button />
      <ButtonWithSomeLogic />
    </>
  );
};
```

### useFetch

```javascript
const App = () => {
  const userId = '1';

  const {
    data: userData,
    isLoading: userIsLoading,
    error: userError
  } = useFetch(`https://api.mydomain/user/${userId}`);

  const profileId = userData?.profileId;

  const {
    data: userProfileData,
    isLoading: userProfileIsLoading,
    error: userProfileError
  } = useFetch(`https://api.mydomain/user/${profileId}/profile`);

  if (userError || userProfileError) {
    return <div>Something went wrong ...</div>;
  }

  if (userIsLoading || userProfileIsLoading) {
    return <div>Is loading ...</div>;
  }

  return (
    <User
      user={userData}>
      userProfile={userProfileData}
    />
  );
};
```

### portfolio projects

- landing page
- game
- database
- web3 project (blockchain)

### controlled and uncontrolled component

Controlled

- is dependent on the props data `onChange={setState(e.target.value)}`

Uncontrolled

- is not dependent on props data, it uses refs `alert(ref.current.value)`

### useRef() and focus()

```javaScript
const ref = useRef();

useEffect(() => {
  ref.current.focus();
}, []);

return (
  <div>
    <input ref={ref} type="text" />
  </div>
)
```

### React Keys

- A "key" is a special string attribute you need to include when creating lists of elements in React.
- Keys help React identify which items have changed, are added, or are removed from the Lists.
- It also helps to determine which components in a collection needs to be re-rendered instead of re-rendering the entire set of components every time.
- Keys used within arrays should be unique among their siblings. However, they don’t need to be globally unique. We can use the same keys when we produce two different arrays.

### FLOW

- Flow is a static type checker for your JavaScript code. It does a lot of work to make you more productive. Making you code faster, smarter, more confidently, and to a bigger scale.
- Flow checks your code for errors through static type annotations. These types allow you to tell Flow how you want your code to work, and Flow will make sure it does work that way.

[https://flow.org/](https://flow.org/)

### React Flow

- React Flow is a library for building node-based applications.

[https://reactflow.dev/](https://reactflow.dev/)

### JS types

#### Primitive values

| Type      | typeof return value | Object wrapper |
| --------- | ------------------- | -------------- |
| Null      | "object"            | N/A            |
| Undefined | "undefined"         | N/A            |
| Boolean   | "boolean"           | Boolean        |
| Number    | "number"            | Number         |
| BigInt    | "bigint"            | BigInt         |
| String    | "string"            | String         |
| Symbol    | "symbol"            | Symbol         |

### typeOf null

- All primitive types, except null, can be tested by the typeof operator. typeof null returns "object", so one has to use === null to test for null.
- Accessing a property on null or undefined throws a TypeError exception, which necessitates the introduction of the optional chaining operator.

### Optional chaining (?.)

- The optional chaining (?.) operator accesses an object's property or calls a function. If the object is undefined or null, it returns undefined instead of throwing an error.

### Reconciliation

- Difying algorythm React
- Reconciliation is the process through which React updates the Browser DOM.
- The reconciliation process makes React work faster.
- Important concepts behind the working of the Reconciliation process are: **Browser DOM**, **Virtual DOM** and **Diffing Algorithm**

#### The following actions take place in React:

- React stores a copy of Browser DOM which is called Virtual DOM.
- When we make changes or add data, React creates a new Virtual DOM and compares it with the previous one.
- Comparison is done by Diffing Algorithm. The cool fact is all these comparisons take place in the memory and nothing is yet changed in the Browser.
- After comparing, React goes ahead and creates a new Virtual DOM having the changes. It is to note that as many as 200,000 virtual DOM nodes can be produced in a second.
- Then it updates the Browser DOM with the least number of changes possible without rendering the entire DOM again. (Ref: Fig.1) This changes the efficiency of an application tremendously

#### How does this Virtual DOM compare itself to its previous version?

#### This is where the Diffing Algorithm comes into play. Some concepts used by this Algorithm are:

- Two elements of different types will produce different trees.
- Breadth-First Search (BFS) is applied because if a node is found as changed, it will re-render the entire subtree hence Depth First Approach is not exactly optimal. (Ref: Fig.2)
- When comparing two elements of the same type, keep the underlying node as same and only update changes in attributes or styles.
- React uses optimizations so that a minimal difference can be calculated in O(N) efficiently using this Algorithm.

### React hooks

- Hooks are now available with the release of v16.8.0.
- Hooks are functions that let you “hook into” React state and lifecycle features from function components.

| lifecycle method      | hook                 | description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                       | useState             | We call it inside a function component to add some local state to it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| componentDidMount     | useEffect            |
| componentDidUpdate    | useEffect            |
| componentWillUnmount  | useEffect            |
|                       | useContext           |
|                       | useReducer           | An alternative to useState. Accepts a reducer of type (state, action) => newState, and returns the current state paired with a dispatch method. (If you’re familiar with Redux, you already know how this works.)<br>useReducer is usually preferable to useState when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one.<br>useReducer also lets you optimize performance for components that trigger deep updates because you can pass dispatch down instead of callbacks. |
| shouldComponentUpdate | useCallback          | Returns a memoized callback.<br>Pass an inline callback and an array of dependencies. useCallback will return a memoized version of the callback that only changes if one of the dependencies has changed. This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders (e.g. shouldComponentUpdate).                                                                                                                                                                  |
|                       | useMemo              | Returns a memoized value.<br>Pass a “create” function and an array of dependencies. useMemo will only recompute the memoized value when one of the dependencies has changed. This optimization helps to avoid expensive calculations on every render.<br>`const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);`                                                                                                                                                                                                         |
|                       | useRef               |
|                       | useImperativeHandle  |
|                       | useLayoutEffect      | The signature is identical to useEffect, but it fires synchronously after all DOM mutations. Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside useLayoutEffect will be flushed synchronously, before the browser has a chance to paint.                                                                                                                                                                                                                                                             |
|                       | useDebugValue        |
|                       | useDeferredValue     |
|                       | useTransition        |
|                       | useId                | useId is a hook for generating unique IDs that are stable across the server and client, while avoiding hydration mismatches.<br>`const id = useId();`                                                                                                                                                                                                                                                                                                                                                                                        |
|                       | useSyncExternalStore |
|                       | useInsertionEffect   | The signature is identical to useEffect, but it fires synchronously before all DOM mutations. Use this to inject styles into the DOM before reading layout in useLayoutEffect. Since this hook is limited in scope, this hook does not have access to refs and cannot schedule updates.                                                                                                                                                                                                                                                      |

### useCallback

- Returns a memoized callback.
- Pass an inline callback and an array of dependencies. useCallback will return a memoized version of the callback that only changes if one of the dependencies has changed. This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders (e.g. shouldComponentUpdate).

### PureComponent

- The definition of Pure Component says that for specific input parameters, we always have a specific output.
- The output is solely dependent on Input parameters and no other external variable.
- Pure Components in React are the components which do not re-renders when the value of state and props has been updated with the same values. If the value of the previous state or props and the new state or props is the same, the component is not re-rendered. Pure Components restricts the re-rendering ensuring the higher performance of the Component.

### React.memo

- higher-order component
- When **React.memo()** wraps a component, React memoizes the rendered output of the wrapped component then skips unnecessary renderings.

### Class Component Static Methods

- Static properties are properties of a class, not of an instance of a class.
- We can also assign a method to the class as a whole. Such methods are called static.

### Promise static methods (all, allSettled, race)

- The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value.

A Promise is in one of these states:

- pending: initial state, neither fulfilled nor rejected.
- fulfilled: meaning that the operation was completed successfully.
- rejected: meaning that the operation failed.

Methods:

- Promise.prototype.then()
- Promise.prototype.catch()
- Promise.prototype.finally()

Promise concurrency:

- Promise.all()
  - Fulfills when all of the promises fulfill
  - rejects when any of the promises rejects.
- Promise.allSettled()
  - Fulfills when all promises settle.
- Promise.any()
  - Fulfills when any of the promises fulfills
  - rejects when all of the promises reject.
- Promise.race()
  - Settles when any of the promises settles. In other words, fulfills when any of the promises fulfills
  - rejects when any of the promises rejects.

### Boundary Component (Error Boundaries)

- A JavaScript error in a part of the UI shouldn’t break the whole app. To solve this problem for React users, React 16 introduces a new concept of an “error boundary”.
- Error boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed. Error boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them.
- A class component becomes an error boundary if it defines either (or both) of the lifecycle methods static **getDerivedStateFromError()** or **componentDidCatch()**. Use static **getDerivedStateFromError()** to render a fallback UI after an error has been thrown. Use **componentDidCatch()** to log error information.

### React.createPortal

- Normally, when you return an element from a component’s render method, it’s mounted into the DOM as a child of the nearest parent node.
- However, sometimes it’s useful to insert a child into a different location in the DOM.
- Portals provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.
- Even though a portal can be anywhere in the DOM tree, it behaves like a normal React child in every other way. Features like context work exactly the same regardless of whether the child is a portal, as the portal still exists in the React tree regardless of position in the DOM tree.

### Redux, is it async?

- By itself, a Redux store doesn't know anything about async logic. It only knows how to synchronously dispatch actions, update the state by calling the root reducer function, and notify the UI that something has changed. Any asynchronicity has to happen outside the store.
- **redux-saga** is a library that aims to make application side effects (i.e. asynchronous things like data fetching and impure things like accessing the browser cache) easier to manage, more efficient to execute, easy to test, and better at handling failures.

### Redux, why do we need middleware?

- Middleware can enable us to write some kind of async logic that interacts with the Redux store.
- As it turns out, Redux already has an official version of that "async function middleware", called the **Redux "Thunk" middleware**. The thunk middleware allows us to write functions that get dispatch and getState as arguments. The thunk functions can have any async logic we want inside, and that logic can dispatch actions and read the store state as needed.

### Closure

- A closure is when a function has access to variables (can read and change them) defined in its outer scope, even when the function is executed outside of the scope where it was defined. A closure is a function enclosing a reference (variable) to its outer scope. Functions can access variables outside of their scope.
- JavaScript variables can belong to the local or global scope. Global variables can be made local (private) with closures. This is called a JavaScript closure. It makes it possible for a function to have "private" variables.

### Symbol primitive type

- A "symbol" represents a unique identifier.
- Upon creation, we can give symbols a description (also called a symbol name), mostly useful for debugging purposes
- Symbols are guaranteed to be unique. Even if we create many symbols with exactly the same description, they are different values. The description is just a label that doesn’t affect anything.
- So, to summarize, a symbol is a “primitive unique value” with an optional description.
- Symbol.toString()
- Symbol.description
- Symbol.for(key) // global symbol registry
- Symbol.keyFor(sym) // name, global symbol || undefined, not global
- Symbol.hasInstance // System symbols
- Symbol.isConcatSpreadable // System symbols
- Symbol.iterator // System symbols
- Symbol.toPrimitive // System symbols

### JSX transpilation to React.createElement

- When you use JSX, the compiler transforms it into React function calls that the browser can understand. The old JSX transform turned JSX into React.createElement(...) calls.

```javascript
import React from 'react';

function App() {
  return <h1>Hello World</h1>;
}
```

```javascript
import React from 'react';

function App() {
  return React.createElement('h1', null, 'Hello world');
}
```

- JSX transform turns your JSX source code into the JavaScript code a browser can understand
- However, this is not perfect
- Because JSX was compiled into React.createElement, React needed to be in scope if you used JSX.
- There are some performance improvements and simplifications that React.createElement does not allow.
- To solve these issues, React 17 introduces two new entry points to the React package that are intended to only be used by compilers like Babel and TypeScript. Instead of transforming JSX to React.createElement, the new JSX transform automatically imports special functions from those new entry points in the React package and calls them.

```javascript
function App() {
  return <h1>Hello World</h1>;
}
```

```javascript
// Inserted by a compiler (don't import it yourself!)
import { jsx as _jsx } from 'react/jsx-runtime';

function App() {
  return _jsx('h1', { children: 'Hello world' });
}
```

- Note how our original code did not need to import React to use JSX anymore! (But we would still need to import React in order to use Hooks or other exports that React provides.)

### PureComponent as default implementation of shouldComponentUpdate

- PureComponent changes the life-cycle method shouldComponentUpdate and adds some logic to automatically check whether a re-render is required for the component. This allows a PureComponent to call method render only if it detects changes in state or props, hence, one can change the state in many components without having to write extra checks.
- According to PureComponent Documentation it only does a shallow comparison in shouldComponentUpdate().

### Redux toolkit (+ rtk-query) read up on for interviews, could be useful

The Redux Toolkit package is intended to be the standard way to write Redux logic. It was originally created to help address three common concerns about Redux:

- "Configuring a Redux store is too complicated"
- "I have to add a lot of packages to get Redux to do anything useful"
- "Redux requires too much boilerplate code"

We can't solve every use case, but in the spirit of create-react-app, we can try to provide some tools that abstract over the setup process and handle the most common use cases, as well as include some useful utilities that will let the user simplify their application code.

Redux Toolkit also includes a powerful data fetching and caching capability that we've dubbed "RTK Query". It's included in the package as a separate set of entry points. It's optional, but can eliminate the need to hand-write data fetching logic yourself.

These tools should be beneficial to all Redux users. Whether you're a brand new Redux user setting up your first project, or an experienced user who wants to simplify an existing application, Redux Toolkit can help you make your Redux code better.

#### RTK Query

RTK Query is a powerful data fetching and caching tool. It is designed to simplify common cases for loading data in a web application, eliminating the need to hand-write data fetching & caching logic yourself.

### Hoisting

- Variables defined with let and const are hoisted to the top of the block, but not initialized.

### Strict mode

### Lexical scope

### Calllback

### Dziedziczenie / Prototypowanie

- JS nie ma dziedziczenia, jest prototypowanie
- każdy obiekt w JavaScript posiada property prototype, dzięki czemu możliwe jest korzystanie z dziedziczenia

### Rekurencja

- wywołanie funkcji przez samą siebie

### Iteracja

- pętle (for na przykład)

### Big O Notation

- O(1)
- nested loop O(n^2)
- loops O(n)
- n - length of loop input

### JS methods

#### map()

- returns: new array by transforming every element in an array
- is chainable: this means that you can attach reduce(), sort(), filter()
- does not mutate the array on which it is called (however, callback may do so).

#### forEach() method returns undefined

- is not chainable
- does not mutate the array on which it is called (however, callback may do so).

#### filter()

- creates a new array by removing elements that don't belong

#### reduce()

- takes all of the elements in an array and reduces them into a single value

#### some()

- method tests whether at least one element in the array passes the test implemented by the provided function. It returns true if, in the array, it finds an element for which the provided function returns true; otherwise it returns false. It doesn't modify the array.

### SOLID

SOLID to termin jakim zostało nazwane pięć podstawowych zasad, którymi należy się kierować programując obiektowo.

#### S - Single-responsiblity Principle

- Zasada pojedynczej odpowiedzialności (ang. single responsibility principle) - każda klasa powinna być odpowiedzialna za jedną konkretną rzecz.

#### O - Open-closed Principle

- Zasada otwarty/zamknięty (ang. open/close principle) - każda klasa powinna być otwarta na rozbudowę ale zamknięta na modyfikacje.

#### L - Liskov Substitution Principle

- Zasada podstawienia Liskov (ang. liskov substitution principle) - w miejscu klasy bazowej można użyć dowolnej klasy pochodnej (oznacza to, że w całości musi być zachowana zgodność interfejsu i wszystkich metod.).

#### I - Interface Segregation Principle

- Zasada segregacji interfejsów jest bardzo prosta, mówi aby nie tworzyć interfejsów z metodami, których nie używa klasa. Interfejsy powinny być konkretne i jak najmniejsze.

#### D - Dependency Inversion Principle

- Zasada odwrócenia zależności jest prostą i bardzo ważną zasadą. Polega ona na używaniu interfejsu polimorficznego wszędzie tam gdzie jest to możliwe, szczególnie w parametrach funkcji (wszystkie zależności powinny w jak największym stopniu zależeć od abstrakcji a nie od konkretnego typu).

---

### Data structures

---

#### Stack

- Stack follows the principle of LIFO (last In, first out). If you stack books, the top book will be taken before the bottom one. When you browse on the internet, the back button leads you to the most recently browsed page.

COMMON METHODS OF STACK IN JAVASCRIPT

- push: Input a new element.
- pop : Remove the top element, return the removed element.
- peek : Return the top element.
- length : Return the number of element(s) in the stack.

---

#### Queue

- Queue is similar to stack. The only difference is that queue uses the FIFO principle (first in, first out). In other words, when you queue for the bus, the first in the queue will always board first.

QUEUE METHODS IN JAVASCRIPT

- enqueue: Enter queue, add an element at the end.
- dequeue: Leave queue, remove the front element and return it.
- front: Get the first element.
- isEmpty: Determine whether the queue is empty.
- size: Get the number of element(s) in queue.

---

#### Linked List

- A linked list is a chained data structure. Each node consists of two pieces of information: the data of the node and the pointer to the next node. Linked list and conventional array are both linear data structures with serialized storage. Of course, they also have differences:

UNILATERAL LINKED LIST METHODS

- size: Return the number of node(s).
- head: Return the element of the head.
- add: Add another node in the tail.
- remove: Remove a certain node.
- indexOf: Return the index of a node.
- elementAt: Return the node of an index.
- addAt: Insert a node at a specific index.
- removeAt: Delete a node at a specific index.

---

#### Set

- A set is a basic concept in mathematics: a collection of well defined and distinct objects. ES6 introduced the concept of set, which has some similarities to an array. However, a set does not allow repeating elements and is not indexed.

TYPICAL SET METHODS IN JAVASCRIPT

- values: Return all elements in a set.
- size: Return the number of elements.
- has: Determine whether an element exists.
- add: Insert elements into a set.
- remove: Delete elements from a set.
- union: Return the intersection of two sets.
- difference: Return the difference of two sets.
- subset: Determine whether a certain set is a subset of another set.

---

#### Hash Table

- A hash table is a key-value data structure. Due to the lightning speed of querying a value through a key, hash tables are commonly used in map, dictionary or object data structures. As shown in the graph above, the hash table uses a hash function to convert keys into a list of numbers, and these numbers serve as the values of corresponding keys. To get value using a key is fast; time complexity can achieve O(1). The same keys must return the same values, which is the basis of the hash function.

HASH TABLE METHODS IN JAVASCRIPT

- add: Add a key-value pair.
- remove: Delete a key-value pair.
- lookup: Find a corresponding value using a key.

---

#### Tree

- Tree data structure is a non-linear multi-layer data structure in contrast to array, stack and queue. This structure is highly efficient during insert and search operations. Let’s take a look at some concepts of tree data structure:

TREE DATA STRUCTURE CONCEPTS

- root: Root node of a tree; no parent node for root.
- parent node: Direct node of the upper layer; only has one
- child node: Direct node(s) of the lower layer; can have multiple
- siblings: Share the same parent node
- leaf: Node with no child
- Edge: Branch or link between nodes
- Path: The edges from a starting node to the target node
- Height of Node: Number of edges of the longest path of a specific node to leaf node
- Height of Tree: Number of edges of the longest path of the root node to the leaf node
- Depth of Node: Number of edges from root node to specific node
- Degree of Node: Number of child nodes

---

#### Trie

- Trie (pronounced “try”) or “prefix tree” is also a type of search tree. Trie stores the data step-by-step; each node in the tree represents a step. We use trie to store vocabulary so it can be quickly searched, especially for an auto-complete function.
- Each node in trie has an alphabet and following the branch can form a complete word. It also comprises a boolean indicator to show whether or not it’s the end of a string.

METHODS OF TRIE IN JAVASCRIPT

- add: Insert a word into the dictionary tree.
- isWord: Determine whether the tree consists of a certain word.
- print: Return all words in the tree.

---

#### Graph

- Graphs, sometimes known as networks, refer to sets of nodes with linkages (or edges). We can further divide graphs into two groups (i.e. directed graphs and undirected graphs), according to whether the linkages have direction. We use graphs in our daily lives without even realizing it. Graphs help calculate the best route in navigation apps or recommend friends with whom we might like to connect.

### GraphQL

- GraphQL is an open-source data query and manipulation language for APIs, and a runtime for fulfilling queries with existing data.
- GraphQL was developed internally by Facebook (now Meta) in 2012 before being publicly released in 2015.
- On 7 November 2018, the GraphQL project was moved from Facebook to the newly established GraphQL Foundation, hosted by the non-profit Linux Foundation.
- It allows clients to define the structure of the data required, and the same structure of the data is returned from the server. This prevents excessively large amounts of data from being returned.
- The flexibility and richness of the query language also adds complexity that may not be worthwhile for simple APIs.
- The result of a single query is returned in JSON format.

### Type using TypeScript JSON response in functional component

```javascript
// Declaring type of props - see "Typing Component Props" for more examples
type AppProps = {
  message: string,
}; /* use `interface` if exporting so that consumers can extend */

// Easiest way to declare a Function Component; return type is inferred.
const App = ({ message }: AppProps) => <div>{message}</div>;

// you can choose annotate the return type so an error is raised if you accidentally return some other type
const App = ({ message }: AppProps): JSX.Element => <div>{message}</div>;

// you can also inline the type declaration; eliminates naming the prop types, but looks repetitive
const App = ({ message }: { message: string }) => <div>{message}</div>;
```

### TypeScript as

```javascript
const [user, setUser] = useState<User>({} as User);
```

### https://nestjs.com/

### https://medium.com/dvt-engineering/angular-ivy-6cb0c78a2673

### https://www.velotio.com/engineering-blog/react-fiber-algorithm

### https://react-query-v3.tanstack.com/

### https://relay.dev/
