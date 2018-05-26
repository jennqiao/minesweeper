import React from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';

isInsideBoard = (r, c, size) => {

  return (r >=0 && r < size && c>=0 && c < size);
}


const makeBoard = (size, bombs) => {

  let board = [];

  for (let i=0; i<size; i++) {
    let row = new Array(size).fill(0);
    board.push(row); 
  }

  //randomly pick position
  let pickPosition = () => {
    let x = Math.floor(Math.random()*size);
    let y = Math.floor(Math.random()*size);
    return [x, y];
  }

  let addHints = (row, col) => {

    function incrementCounter (r, c) {
      if (isInsideBoard(r,c,size) && board[r][c] >=0) {
        board[r][c] += 1
      }
    }
    
    incrementCounter(row-1, col);
    incrementCounter(row+1, col);
    incrementCounter(row, col+1);
    incrementCounter(row, col-1);
    incrementCounter(row-1, col-1);
    incrementCounter(row-1, col+1);
    incrementCounter(row+1, col-1);
    incrementCounter(row+1, col+1);
  }

  //place bomb
  for (let i=0; i<bombs; i++) {
    let position = pickPosition();
    while (board[position[0]][position[1]] < 0) {
      position = pickPosition();
    }
    board[position[0]][position[1]] = -1;
    //add in edge numbers
    addHints(position[0], position[1]);
  }

  console.log('here is board', board);
  return board;
}



export default class App extends React.Component {

  constructor( props) {
    super(props);
    this.state = {
      board: [],
      currentBoard: []
    }
    this.handlePress = this.handlePress.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  componentDidMount() {
    this.setState({
      board: makeBoard(8, 10),
      currentBoard: makeBoard(8),
      hasLost: false,
      size: 8
    })
  }

  resetGame() {
    this.setState({
      board: makeBoard(8, 10),
      currentBoard: makeBoard(8),
      hasLost: false
    })
  }

  revealSquares (board, row, col) {
  
    const toggleSquare = (r, c) => {
      if (isInsideBoard(r,c,this.state.size) && this.state.board[r][c] !== -1 && this.state.currentBoard[r][c] === 0 ) {
        board[r][c] = 1;
        if (this.state.board[r][c] === 0) {
          this.revealSquares(board, r, c);
        }
      }
    }
    
    toggleSquare(row-1, col);
    toggleSquare(row+1, col);
    toggleSquare(row, col+1);
    toggleSquare(row, col-1);
    toggleSquare(row-1, col-1);
    toggleSquare(row-1, col+1);
    toggleSquare(row+1, col-1);
    toggleSquare(row+1, col+1);
  }
  

  handlePress (row, col) {

    if (this.state.hasLost) {
      return;
    }

    let board = this.state.currentBoard.slice(0);
    board[row][col] = 1;

    if (this.state.board[row][col] === -1) {
      this.setState({
        hasLost: true
      })
    } else if (this.state.board[row][col] === 0) {
      this.revealSquares(board, row, col);
    }

    this.setState({
      currentBoard: board
    })

  }

  render() {

    const touchableView = (r, c) => (

      <TouchableHighlight onPress={() => this.handlePress(r,c)}>
                        <View style={[styles.cell, styles.cellHidden]} >
                        </View>
                      </TouchableHighlight>
    )

    const touchedView = (r, c) => (
      <View style={[styles.cell, styles.cellRevealed]} >
        <Text>{this.state.board[r][c]===-1 ? '💣' : this.state.board[r][c]}</Text>
      </View>
    )

    return (

      <View style={styles.container}>
        <Text style={styles.title}>Jenn's Minesweeper Game</Text>
        <Text style={styles.title}>{this.state.hasLost ? 'You lost!' : '' }</Text>
        <View style={styles.board}>
          {this.state.currentBoard.map((row, r) => {
            return (
              <View style={styles.row} >
              <View />
              {
                row.map((cell, c) => (
                  cell ? touchedView(r,c) : touchableView(r, c) 
                ))
              }
              </View>
            )
          })}
        
        </View>
        <Button
            onPress={this.resetGame}
            title="Reset Game"
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    // flexDirection: 'row'
  },
  title: {
    fontFamily: 'Chalkduster',
    fontSize: 20,
    marginBottom: 20,
  },
  board: {
    padding: 5,
    backgroundColor: '#47525d',
    borderRadius: 10,
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#000000',
    // flexDirection: 'row'
  },
  cellHidden: {
    backgroundColor: '#D3D3D3',    
    // borderStyle: 'dotted'
  },
  cellRevealed: {
    backgroundColor: '#939393',    
  }
});
