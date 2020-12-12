import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import db from "../config";

export default class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allTransactions: [],
      lastVisibleTransaction: null,
      search: null,
    };
  }

  componentDidMount = async () => {
    //const query = await db.collection("transactions").get();
    const query = await db.collection("transactions").limit(10).get();
    //console.log(query);

    query.docs.map((doc) => {
      // console.log("docData" + doc.data());
      console.log(
        "transactions in state before spread" + this.state.allTransactions
      );
      this.setState({
        //using the spread operator here because each time when it comes
        // to set the data for allTransactions, a new record would be there as we are inside
        //the map command(which works like FOR loop)
        //As the entire data has to be appended to the allTransactions array, we are
        //using spread operator WHICH CONCATENATES THE PREVIOUS DATA ALONG WITH THE
        //NEW DATA
        allTransactions: [...this.state.allTransactions, doc.data()],
        lastVisibleTransaction: doc,
        //search :''
      });
      console.log(...this.state.allTransactions);
      console.log(this.state.lastVisibleTransaction);
    });
  };

  fetchMoreTransactions = async () => {
    console.log(this.state);
    if (this.state.search !== null) {
      var text = this.state.search.toUpperCase();

      var enteredText = text.split("");

      if (enteredText[0].toUpperCase() === "B") {
        const query = await db
          .collection("transactions")
          .where("bookId", "==", text)
          .startAfter(this.state.lastVisibleTransaction)
          .limit(10)
          .get();

        query.docs.map((doc) => {
          this.setState({
            //using the spread operator here because each time when it comes
            // to set the data for allTransactions, a new record would be there as we are inside
            //the map command(which works like FOR loop)
            //As the entire data has to be appended to the allTransactions array, we are
            //using spread operator WHICH CONCATENATES THE PREVIOUS DATA ALONG WITH THE
            //NEW DATA
            allTransactions: [...this.state.allTransactions, doc.data()],
            lastVisibleTransaction: doc,
          });
        });
      } else if (enteredText[0].toUpperCase() === "S") {
        const query = await db
          .collection("transactions")
          .where("studentId", "==", text)
          .startAfter(this.state.lastVisibleTransaction)
          .limit(10)
          .get();

        query.docs.map((doc) => {
          this.setState({
            allTransactions: [...this.state.allTransactions, doc.data()],
            lastVisibleTransaction: doc,
          });
        });
      }
    } else {
      const query = await db
        .collection("transactions")
        .startAfter(this.state.lastVisibleTransaction)
        .limit(10)
        .get();

      query.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastVisibleTransaction: doc,
        });
      });
    }
  };

  searchTransactions = async (text) => {
    var enteredText = text.split("");

    var text = text.toUpperCase();
    console.log(enteredText);
    this.setState({ allTransactions: [] });

    if (enteredText[0].toUpperCase() === "B") {
      const transaction = await db
        .collection("transactions")
        .where("bookId", "==", text)
        .get();

      transaction.docs.map((doc) => {
        console.log(doc.data());
        this.setState({
          //using the spread operator here because each time when it comes
          // to set the data for allTransactions, a new record would be there as we are
          //inside the map command(which works like FOR loop)
          //As the entire data has to be appended to the allTransactions array, we are
          //using spread operator WHICH CONCATENATES THE PREVIOUS DATA ALONG WITH THE
          //NEW DATA
          allTransactions: [...this.state.allTransactions, doc.data()],
          //allTransactions : doc.data(),
          lastVisibleTransaction: doc,
        });
      });
    } else if (enteredText[0].toUpperCase() === "S") {
      const transaction = await db
        .collection("transactions")
        .where("studentId", "==", text)
        .get();

      transaction.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          //allTransactions : doc.data(),
          lastVisibleTransaction: doc,
        });
      });
    }
  };

  render() {
    return (
      /* <ScrollView>
        {this.state.allTransactions.map((transaction,index)=>{
          return (
            <View key={index} style={{ borderBottomWidth: 2 }}>
              <Text>{"Book Id : " + transaction.bookId}</Text>
              <Text>{"Student Id : " + transaction.studentId}</Text>
              <Text>{"Transaction Type : " + transaction.transactionType}</Text>
              <Text>{"Date : " + transaction.date.toDate()}</Text>

            </View>
          );
        })}
    </ScrollView>*/
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.bar}
            placeholder="Enter Book ID or Student ID"
            onChangeText={(text) => {
              this.setState({
                search: text,
              });
            }}
          ></TextInput>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              this.searchTransactions(this.state.search);
            }}
          >
            <Text>Search</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={this.state.allTransactions}
          renderItem={({ item }) => (
            <View style={{ borderBottomWidth: 2 }}>
              <Text>{"Book Id: " + item.bookId}</Text>
              <Text>{"Student Id: " + item.studentId}</Text>
              <Text>{"Transaction Type: " + item.transactionType}</Text>
              <Text>{"Date: " + item.date.toDate()}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this.fetchMoreTransactions}
          onEndReachedThreshold={0.7}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  searchBar: {
    flexDirection: "row",
    height: 40,
    width: "auto",
    borderWidth: 0.5,
    alignItems: "center",
    backgroundColor: "grey",
  },
  bar: {
    borderWidth: 2,
    height: 30,
    width: 300,
    paddingLeft: 10,
  },
  searchButton: {
    borderWidth: 1,
    height: 30,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
  },
});
