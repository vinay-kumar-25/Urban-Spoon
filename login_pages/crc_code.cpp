#include <iostream>
using namespace std;

int ctoi(char c) { 
    return c - '0';  
}

char itoc(int i) {  
    return i + '0';  
}

int main() {
    cout << "Enter the sender message: ";
    string msg;
    cin >> msg;

    cout << "Enter the generator function: ";
    string genfu;
    cin >> genfu;

    string mainmsg = msg;  

    int genlen = genfu.size();
    int msglen = msg.size();

    
    msg.append(genlen - 1, '0');

    cout << "Message after appending zeros: " << msg << endl;

    
    for (int i = 0; i <= msglen - 1; i++) {
        if (msg[i] == '0') continue; 

        for (int j = 0; j < genlen; j++) {
            int xorval = ctoi(msg[i + j]) ^ ctoi(genfu[j]);
            msg[i + j] = itoc(xorval);
        }
    }

    
    string remainder = msg.substr(msglen, genlen - 1);
    string encoded_msg = mainmsg + remainder;

    cout << "Final CRC codeword: " << encoded_msg << endl;
    cout << "Remainder (CRC Checksum): " << remainder << endl;

    return 0;
}
