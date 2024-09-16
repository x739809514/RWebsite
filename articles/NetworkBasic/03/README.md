## RUDP

RUDP is a reliable UDP protocol. Different with the common UDP, RUDP provide a way to process the packets which are out of order, and it can resend packet. In RUDP, each packet has a unique sequence to store its order, if one packet is late, it will be store in a cache temporarily, after the missing packet arrived , it will be processed and insert in the message at the correct position.

### Client in RUDP

```c#
private void SendData(string message)
{
    byte[] sendData = System.Text.Encoding.UTF8.GetBytes(message);
    byte[] packet = AttachSequenceToPacket(sendData);
    SendPacketHandle(packet);
}

// attach sequence number to packet
private byte[] AttachSequenceToPacket(byte[] data)
{
    byte[] packet = new byte[data.Length + sizeof(int)];
    BitConverter.GetBytes(nextSequenceNumber).CopyTo(packet,0);
    data.CopyTo(packet,sizeof(int));

    sendDataDic.Add(nextSequenceNumber,packet);
    nextSequenceNumber++;
    return packet;
}

private void ReceiveData(byte[] packet)
{
    int sequenceNumber = BitConverter.ToInt32(packet,0);
    if (sequenceNumber==expectedSequenceNumber)
    {
        byte[] data = new byte[packet.Length - sizeof(int)];
        Array.Copy(packet,sizeof(int),data,0,data.Length);

        // process receive data
        PrintData(data);

        expectedSequenceNumber++;
        while (sendDataDic.ContainsKey(expectedSequenceNumber))
        {
            byte[] outOrderData = new byte[packet.Length - sizeof(int)];
            Array.Copy(packet,sizeof(int),outOrderData,0,outOrderData.Length);

            // process receive data
            PrintData(outOrderData);

            sendDataDic.Remove(expectedSequenceNumber);
            expectedSequenceNumber++;
        }
    }
    else
    {
        sendDataDic.Add(expectedSequenceNumber,packet);
    }
}
```

In  `AttachSequenceToPacket()`, we add a sequence for each packet.

In `ReceiveData()`,  it get a sequence first, then compare the sequence with the expected sequence, if these two sequence are same, it means the packet is in order, if not, that means there are packets out of order, then add the sequence that belongs the missing packet to the cache. After the packet is arrived, process it.

### Server in RUDP

The following code is about RUDP server, it receive packets from clients and check duplicate packets, if packets are not duplicate, they will be stored in cache, and check if any garbled packets are waiting to be processed.

```c#
private void ReceiveData(byte[] packet)
{
    int sequenceNumber = BitConverter.ToInt32(packet, 0);

    if (receiveDataDic.ContainsKey(sequenceNumber)==false)
    {
        receiveDataDic.Add(sequenceNumber, packet);

        while (receiveDataDic.ContainsKey(nextSequenceNumber))
        {
            byte[] data = receiveDataDic[nextSequenceNumber];

            //process data
            PrintData(data);

            receiveDataDic.Remove(nextSequenceNumber);
            nextSequenceNumber++;
        }
    }

    SendAcknowledge(sequenceNumber);
}

private void SendAcknowledge(int sequenceNumber)
{
    byte[] data = System.Text.Encoding.UTF8.GetBytes(sequenceNumber.ToString());
    SendHandle(data,remoteEndPoint);
}
```


