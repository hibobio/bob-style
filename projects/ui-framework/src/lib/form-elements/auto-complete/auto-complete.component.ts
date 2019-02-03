import { Component, forwardRef, OnInit } from '@angular/core';
import { BaseInputElement } from '../base-input-element';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AvatarSize } from '../../buttons-indicators/avatar';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { map, startWith, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'b-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutoCompleteComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AutoCompleteComponent),
      multi: true
    }
  ],
})
export class AutoCompleteComponent extends BaseInputElement implements OnInit {

  options: any = [
    {
      id: '1789840653568443152',
      displayName: 'Pablo Escobar',
      avatar: 'https://cdn.filestackcontent.com/zVtpbknNTF6pQyzdnxNM?policy=eyJoYW5kbGUiOiJ6VnRwYmtuTlRGNnBReXpkbnhOTSIsImV4cGlyeSI6NDYzNTkxODcwNCwiY2FsbCI6WyJyZWFkIiwgImNvbnZlcnQiXX0=&signature=db8ddcad4c8bcaa1f08a46f5c43a3748764e6d9c0d6cdd9aee7eaf1996c96d63'
    },
    {
      id: '1720274302193894094',
      displayName: 'Tia Davidson',
      avatar: 'https://cdn.filepicker.io/api/file/mSZcYn4iRomv8SZg3W8a?signature=a1c1514dd4447b2e2e0316bda9219462e8b792dd4ebdbe79e89b8e2d864cdcb0&policy=eyJoYW5kbGUiOiJtU1pjWW40aVJvbXY4U1pnM1c4YSIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274301447307981',
      displayName: 'Sarah Gill',
      avatar: 'https://cdn.filepicker.io/api/file/MXMs1ab9TiENC3OZWBjo?signature=3668190ee11cc0e12728e7042e22a2bca055c8cf9a53030ecde4d7d46d9a2db2&policy=eyJoYW5kbGUiOiJNWE1zMWFiOVRpRU5DM09aV0JqbyIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274305876493012',
      displayName: 'Joy Vance',
      avatar: 'https://cdn.filepicker.io/api/file/8SBH9wxTQCeFszcPB4kz?signature=5de409f4112d5d0c255474231c15254635124fc64e0d155bbf951804f3d27179&policy=eyJoYW5kbGUiOiI4U0JIOXd4VFFDZUZzemNQQjRreiIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274303276024528',
      displayName: 'Joe Mason',
      avatar: 'https://cdn.filestackcontent.com/oCRTiVe3R6Kzjv657siZ?policy=eyJoYW5kbGUiOiJvQ1JUaVZlM1I2S3pqdjY1N3NpWiIsImV4cGlyeSI6NDYzNTkxODcwNCwiY2FsbCI6WyJyZWFkIiwgImNvbnZlcnQiXX0=&signature=d15b6f8991110bbedef33fc24d6ecbdb212f562ef239ef0f5b3407bda7360629'
    },
    {
      id: '1720274282816209587',
      displayName: 'Jane Baker',
      avatar: 'https://cdn.filepicker.io/api/file/KXRa1NK3SwGXj0v6fLHk?signature=f3ff07dd4d82ff566268612bcc6de3a89ef00095863caba803b86d3a037c4858&policy=eyJoYW5kbGUiOiJLWFJhMU5LM1N3R1hqMHY2ZkxIayIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1785392490652631079',
      displayName: 'Yoel Geva',
      avatar: 'https://cdn.filestackcontent.com/p64o5Js1Ss6GPxuQFSMm?policy=eyJoYW5kbGUiOiJwNjRvNUpzMVNzNkdQeHVRRlNNbSIsImV4cGlyeSI6NDYzNTkxODcwNCwiY2FsbCI6WyJyZWFkIiwgImNvbnZlcnQiXX0=&signature=05378c191060334da351c92da235db299a6b8cf248286c089975533d1e8f1cad'
    },
    {
      id: '1720274281104933553',
      displayName: 'Niall Finley\'s',
      avatar: 'https://cdn.filepicker.io/api/file/QqAbgHVNQ46VFlLoNZ0x?signature=a1034df03ed7fae51af64151731b767c28799f68b1bf13e5a7a464d38019929b&policy=eyJoYW5kbGUiOiJRcUFiZ0hWTlE0NlZGbExvTloweCIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274300407120587',
      displayName: 'George Devin',
      avatar: 'https://cdn.filepicker.io/api/file/ovuVrCHnQoafhI8OTyH1?signature=fa54d174031a7cb8b44ecebbda1a9a5e685fd9dfe36e75c6589c8393df92b39a&policy=eyJoYW5kbGUiOiJvdnVWckNIblFvYWZoSThPVHlIMSIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274307185115862',
      displayName: 'Malcolm Farish',
      avatar: 'https://cdn.filepicker.io/api/file/8MLO77jpTdiAVvSIUZ2M?signature=5f87ce2c46821a1a3d1a9758c1ed9d3d11f07411bdfb13c752b97ba08f3d3244&policy=eyJoYW5kbGUiOiI4TUxPNzdqcFRkaUFWdlNJVVoyTSIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274299811529418',
      displayName: 'Naomi Hibbert',
      avatar: 'https://cdn.filepicker.io/api/file/TH7Te2VTpiLYukAqJoTb?signature=f10397f5ce8298f3a653d526df791c3f113b43486f844fdb9895fd2f22d7b8b8&policy=eyJoYW5kbGUiOiJUSDdUZTJWVHBpTFl1a0FxSm9UYiIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274289225106107',
      displayName: 'Toby Atkinson',
      avatar: 'https://cdn.filepicker.io/api/file/v3SKTUZPSFuAzcUNECzK?signature=f3133889870140eae9106a55cdf6b6994832a936afbde7f3e3f1ce47a27ab3d7&policy=eyJoYW5kbGUiOiJ2M1NLVFVaUFNGdUF6Y1VORUN6SyIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274286138098359',
      displayName: 'Summer Hall',
      avatar: 'https://cdn.filepicker.io/api/file/OI6RmHZ2Q2uZjDPsShzS?signature=3805df13a844a09f9a0c07a40e250723136f9e1cb172b6af39dfdadf068048ee&policy=eyJoYW5kbGUiOiJPSTZSbUhaMlEydVpqRFBzU2h6UyIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274303997444817',
      displayName: 'Joel Hammond',
      avatar: 'https://cdn.filestackcontent.com/6qZYtV5YQdClrGgiZ5U8?policy=eyJoYW5kbGUiOiI2cVpZdFY1WVFkQ2xyR2dpWjVVOCIsImV4cGlyeSI6NDYzNTkxODcwNCwiY2FsbCI6WyJyZWFkIiwgImNvbnZlcnQiXX0=&signature=b791e98babb8fdd5d05870bd42224ea1b2442a2e17e9239b4336cd24ea3f9071'
    },
    {
      id: '1720274297160729286',
      displayName: 'Zoe Clark',
      avatar: 'https://cdn.filepicker.io/api/file/FgyFbX14RfazO6UX9ZpF?signature=93944eb75984a39c667d8b7e152cb71117a77d93f6216d4bb2fddfaecdc0212c&policy=eyJoYW5kbGUiOiJGZ3lGYlgxNFJmYXpPNlVYOVpwRiIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1740737344614432917',
      displayName: 'ami sami',
      avatar: 'https://cdn.filestackcontent.com/dDRK3RP4S16Vngnc9X6x?policy=eyJoYW5kbGUiOiJkRFJLM1JQNFMxNlZuZ25jOVg2eCIsImV4cGlyeSI6NDYzNTkxODcwNCwiY2FsbCI6WyJyZWFkIiwgImNvbnZlcnQiXX0=&signature=d5b5da8cc35c733bf5ec0f4d1f04f61b6d8fa2591a0b3387de65eae309db2912'
    },
    {
      id: '1720274271818744496',
      displayName: 'Omri Hecht',
      avatar: 'https://cdn.filestackcontent.com/0BxE8SWZQMG8ShqePmeG?policy=eyJoYW5kbGUiOiIwQnhFOFNXWlFNRzhTaHFlUG1lRyIsImV4cGlyeSI6NDYzNTkxODcwNCwiY2FsbCI6WyJyZWFkIiwgImNvbnZlcnQiXX0=&signature=8d2ed2e27aa4138f68e2f0da9c368594121ebeadd9b99f434299bfc75ffd61f5'
    },
    {
      id: '1720274287161508536',
      displayName: 'Patrick Kirby',
      avatar: 'https://cdn.filepicker.io/api/file/bG7ooigPR0Ytca322nex?signature=85002e49ea52b616f84dea12b2dc888a63160d5fb34994298a376e608e34f224&policy=eyJoYW5kbGUiOiJiRzdvb2lnUFIwWXRjYTMyMm5leCIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274284485542581',
      displayName: 'Lara Hunter',
      avatar: 'https://cdn.filepicker.io/api/file/0tY2PCjRTxmv2Vhz0OyV?signature=0b4afbfe1b200a3cab1928dadbc1626375243d700766af12b2383df4c8489399&policy=eyJoYW5kbGUiOiIwdFkyUENqUlR4bXYyVmh6ME95ViIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1754324904225800265',
      displayName: 'omar sharif',
      avatar: 'https://cdn.filestackcontent.com/Vhg0onIZSXCoq2X3igcp?policy=eyJoYW5kbGUiOiJWaGcwb25JWlNYQ29xMlgzaWdjcCIsImV4cGlyeSI6NDYzNTkxODcwNCwiY2FsbCI6WyJyZWFkIiwgImNvbnZlcnQiXX0=&signature=c6c183ee23da56d1bd5b9cb3c75bcaac820df3ad5339dfca35f36c3d936191db'
    },
    {
      id: '1738495624124301842',
      displayName: 'ami danus',
      avatar: 'https://cdn.filestackcontent.com/BP9jiceKQkyXctICJnWy?policy=eyJoYW5kbGUiOiJCUDlqaWNlS1FreVhjdElDSm5XeSIsImV4cGlyeSI6NDYzNTkxODcwNCwiY2FsbCI6WyJyZWFkIiwgImNvbnZlcnQiXX0=&signature=a0854fa7779169764220cd2b14a5a5e7a643433c30efaea6c2bf48498f09d150'
    },
    {
      id: '1898658225335566407',
      displayName: 'ami Butthead X',
      avatar: 'https://cdn.filestackcontent.com/gwedX8kPQhy75ai78cUL?policy=eyJoYW5kbGUiOiJnd2VkWDhrUFFoeTc1YWk3OGNVTCIsImV4cGlyeSI6NDYzNTkxODcwNCwiY2FsbCI6WyJyZWFkIiwgImNvbnZlcnQiXX0=&signature=3a121f9dcd610f24a73eabb0b1fb146dcf02ca44d516ffd7f4f5b2820d629f85'
    },
    {
      id: '1730054042987528441',
      displayName: 'Ami O\'bama',
      avatar: 'https://cdn.filestackcontent.com/YfOF8FSwRuH5CrhnecxV?policy=eyJoYW5kbGUiOiJZZk9GOEZTd1J1SDVDcmhuZWN4ViIsImV4cGlyeSI6NDYzNTkxODcwNCwiY2FsbCI6WyJyZWFkIiwgImNvbnZlcnQiXX0=&signature=59666eb9bfc00f5f0a41cd7da1343ab303d73470333e1c486296c9ab37582bb2'
    },
    {
      id: '1720274305163461331',
      displayName: 'Sussane Solomon',
      avatar: 'https://cdn.filepicker.io/api/file/PQBySA0ZSIePPu9O4LUa?signature=09df360c8ac0c373bc0ad64110c70cdc2fb08b91937998282dfdf4f542e84a05&policy=eyJoYW5kbGUiOiJQUUJ5U0EwWlNJZVBQdTlPNExVYSIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274287849374393',
      displayName: 'Mason White',
      avatar: 'https://cdn.filepicker.io/api/file/Go8our63QayppgA6IpwG?signature=ba254c85c7f1ab7a0bf82a21911dc25fe02b684786e48797ccab300058c55926&policy=eyJoYW5kbGUiOiJHbzhvdXI2M1FheXBwZ0E2SXB3RyIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1727607965109715591',
      displayName: 'ami ami',
      avatar: 'https://cdn.filestackcontent.com/HzQHHcp6Tu69v4R8QoXY?policy=eyJoYW5kbGUiOiJIelFISGNwNlR1Njl2NFI4UW9YWSIsImV4cGlyeSI6NDYzNTkxODcwNCwiY2FsbCI6WyJyZWFkIiwgImNvbnZlcnQiXX0=&signature=5e3da24dd21f091c2b48582f361b81c228bc924e4dec70c4ba04e9f40640f077'
    },
    {
      id: '1720274288562406074',
      displayName: 'Joshua Tyler',
      avatar: 'https://cdn.filepicker.io/api/file/eS1wBY3VRnGtDBH8cPTw?signature=a594b8018d25d6fa3dd7dcc382634cc64ef5a86eb02806fbf1b7416833216a51&policy=eyJoYW5kbGUiOiJlUzF3QlkzVlJuR3REQkg4Y1BUdyIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274281809576626',
      displayName: 'Darren Lavery',
      avatar: 'https://cdn.filepicker.io/api/file/mn55Uz0NSDS5KH0vLnO9?signature=da2ad3ed91841d145b2d8a9878e0bd6b1a57d656ded886ceb0855d8f440da371&policy=eyJoYW5kbGUiOiJtbjU1VXowTlNEUzVLSDB2TG5POSIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274290978325181',
      displayName: 'Frederick Bateson',
      avatar: 'https://cdn.filepicker.io/api/file/X5xPsrIgRKy6RLnLacBS?signature=711ee717910b4e8845d27315dfbfc23bfbf743db1ae3e3ac610b4cb6fce04d6c&policy=eyJoYW5kbGUiOiJYNXhQc3JJZ1JLeTZSTG5MYWNCUyIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274302680433359',
      displayName: 'Oliver Abbott',
      avatar: 'https://cdn.filepicker.io/api/file/vYp75KJIT6mKQxpk1INP?signature=67486907eba6eedd0e3838e4de908a2218dd107b11fb1034bb444ab4e5181472&policy=eyJoYW5kbGUiOiJ2WXA3NUtKSVQ2bUtReHBrMUlOUCIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274290290459324',
      displayName: 'Morgan Blackburn',
      avatar: 'https://cdn.filepicker.io/api/file/Z7vxWZO1QxyNE2QwMqc4?signature=45ed87c3c5391e8508cdf631390c9e22e14087bcfeaa06f1587ca3aea6e4a5b5&policy=eyJoYW5kbGUiOiJaN3Z4V1pPMVF4eU5FMlF3TXFjNCIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274296556749509',
      displayName: 'Anna Gibbons',
      avatar: 'https://cdn.filepicker.io/api/file/9rDeFW23QUe7Ujgv6ShN?signature=3c8ca5b3207e411a0b0a2b8a5f5670f04714d7074a8bb413513d30fe4c18dfa4&policy=eyJoYW5kbGUiOiI5ckRlRlcyM1FVZTdVamd2NlNoTiIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274294467986114',
      displayName: 'Austin Legge',
      avatar: 'https://cdn.filepicker.io/api/file/2ULF4joqTiOwlmZSx15V?signature=40b3ba47be8d2c8cc18822812f81cc39b658a338d9d0779c94ddb4e3e1acca6c&policy=eyJoYW5kbGUiOiIyVUxGNGpvcVRpT3dsbVpTeDE1ViIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274307839427287',
      displayName: 'Richard Kilmister',
      avatar: 'https://cdn.filepicker.io/api/file/KkteMxj6SHespKLgTK8p?signature=8c410e8c5c70eb7ad69417b3f49059cf794eb9c36cf730565d68307351f9bac8&policy=eyJoYW5kbGUiOiJLa3RlTXhqNlNIZXNwS0xnVEs4cCIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274293637513921',
      displayName: 'Audrey Darby',
      avatar: 'https://cdn.filepicker.io/api/file/Y7MD4n4TSaegWnhOBlP0?signature=205fe404620ef228f95538e72b4c35b1644056e6ff32bbe5e7ea1c2de9c11890&policy=eyJoYW5kbGUiOiJZN01ENG40VFNhZWdXbmhPQmxQMCIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1951501872091103634',
      displayName: 'aaa bbb',
      avatar: 'https://images.hibob.com/default-avatars/AB_5.png'
    },
    {
      id: '1720274283713790644',
      displayName: 'Sofia Hopkins X',
      avatar: 'https://cdn.filepicker.io/api/file/gCBcbZCReOd1sArVYkRf?signature=30fb14dd9587441ca4ea9d5e6376ff825519f5690371db9b0ca586a0cc659f4c&policy=eyJoYW5kbGUiOiJnQ0JjYlpDUmVPZDFzQXJWWWtSZiIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274304567870162',
      displayName: 'Kian Roberts',
      avatar: 'https://cdn.filepicker.io/api/file/KDtZVE2RM2RQAtu3fp7o?signature=50370269f8ef40c93612487cc3cb4f61a8b0cb58b72063ff37bb3fdb40bb3dc4&policy=eyJoYW5kbGUiOiJLRHRaVkUyUk0yUlFBdHUzZnA3byIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274297882149575',
      displayName: 'Amy MilesS',
      avatar: 'https://cdn.filepicker.io/api/file/seOXHnzGTEScdNfpiRVg?signature=2b181c2af30e3fa13497ab797f895fd6ef9283c0f6d882bde7654c73532fccbf&policy=eyJoYW5kbGUiOiJzZU9YSG56R1RFU2NkTmZwaVJWZyIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1892699106254520656',
      displayName: 'Borat Sagdiyev',
      avatar: 'https://cdn.filestackcontent.com/Rb7svT3XRRyAU58fk7X8?policy=eyJoYW5kbGUiOiJSYjdzdlQzWFJSeUFVNThmazdYOCIsImV4cGlyeSI6NDYzNTkxODcwNCwiY2FsbCI6WyJyZWFkIiwgImNvbnZlcnQiXX0=&signature=7c9ddcf12b15ff8e62b48b57e5c39818c56ec8ab91fc9531b52ba3e70258cddc'
    },
    {
      id: '1720274306472084181',
      displayName: 'Sharon Bohgal',
      avatar: 'https://cdn.filepicker.io/api/file/utSYiFfgSp6ousPcJQw1?signature=acd411f97a36ece76843b1d7986a7f3235b4d7bd496dd2c1aa42c8c8e01212f3&policy=eyJoYW5kbGUiOiJ1dFNZaUZmZ1NwNm91c1BjSlF3MSIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274298561626824',
      displayName: 'Finley Day',
      avatar: 'https://cdn.filepicker.io/api/file/STAJpIQkQqbeudBhP7CZ?signature=fc069ad18bc31de88ccb258f4e19ce99048cd114c2fde67734fe32f2acb35ca0&policy=eyJoYW5kbGUiOiJTVEFKcElRa1FxYmV1ZEJoUDdDWiIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1927619454817010495',
      displayName: 'Applicant Trump',
      avatar: 'https://images.hibob.com/default-avatars/AT_39.png'
    },
    {
      id: '1720274295810163396',
      displayName: 'Faith Dale',
      avatar: 'https://cdn.filestackcontent.com/TudyYsw4Q2Gxt8ShfoUg?policy=eyJoYW5kbGUiOiJUdWR5WXN3NFEyR3h0OFNoZm9VZyIsImV4cGlyeSI6NDYzNTkxODcwNCwiY2FsbCI6WyJyZWFkIiwgImNvbnZlcnQiXX0=&signature=060147ab296a1273edeb549f5c77dce3d660c3816bb12f455c66aba17a6d8438'
    },
    {
      id: '1720274295139074755',
      displayName: 'Laura FrancisS',
      avatar: 'https://cdn.filepicker.io/api/file/h2lP6ydyQvKDXp2eaFfW?signature=6409aa23665ea677e9d88bf10e9eee850f3c347fae2d966755d3f9b05b2366ea&policy=eyJoYW5kbGUiOiJoMmxQNnlkeVF2S0RYcDJlYUZmVyIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274309332599513',
      displayName: 'Laura Gardiner',
      avatar: 'https://cdn.filepicker.io/api/file/Lcvja3oTmGXkM7a4m7sC?signature=2b35350f796be9acdef9554a12ed440704fd962fb21e7828f29a17ba5d1df622&policy=eyJoYW5kbGUiOiJMY3ZqYTNvVG1HWGtNN2E0bTdzQyIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1902909469369565330',
      displayName: 'Donald Trump',
      avatar: 'https://cdn.filestackcontent.com/u4pISBufQxCTqCtYnEog?policy=eyJoYW5kbGUiOiJ1NHBJU0J1ZlF4Q1RxQ3RZbkVvZyIsImV4cGlyeSI6NDYzNTkxODcwNCwiY2FsbCI6WyJyZWFkIiwgImNvbnZlcnQiXX0=&signature=31e64f097c0b2f56bca431cdf3726b5405fdcbd5b5e7bef1015f52b3db1aea9a'
    },
    {
      id: '1720274291565527742',
      displayName: 'Alan Tullin',
      avatar: 'https://cdn.filepicker.io/api/file/ml0LGKykRhGmxFjDewPf?signature=edb13d752ebf572a63067123b4ecd597b8b6c3d2ef7e7926fe7d855bdf7ee70e&policy=eyJoYW5kbGUiOiJtbDBMR0t5a1JoR214RmpEZXdQZiIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274308544070360',
      displayName: 'Shawn Cate',
      avatar: 'https://cdn.filepicker.io/api/file/r7gFNsS8TVaoqAC5L8fz?signature=3a3a2b0c814a8a7c2edaefe6dfef43e4f7170890976767157fdd4fcfc204756c&policy=eyJoYW5kbGUiOiJyN2dGTnNTOFRWYW9xQUM1TDhmeiIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
    {
      id: '1720274299165606601',
      displayName: 'William Morris',
      avatar: 'https://cdn.filestackcontent.com/UB15QIjLRPOUJR921W90?policy=eyJoYW5kbGUiOiJVQjE1UUlqTFJQT1VKUjkyMVc5MCIsImV4cGlyeSI6NDYzNTkxODcwNCwiY2FsbCI6WyJyZWFkIiwgImNvbnZlcnQiXX0=&signature=38846f8cc56d75ea2be8ea8c7bf9a5e3a7c86d411cf45a2a652239e9a39f566c'
    },
    {
      id: '1774691128109433595',
      displayName: 'Avi onboarding',
      avatar: 'https://cdn.filestackcontent.com/zRbvlt86QWuNLJQDolzH?policy=eyJoYW5kbGUiOiJ6UmJ2bHQ4NlFXdU5MSlFEb2x6SCIsImV4cGlyeSI6NDYzNTkxODcwNCwiY2FsbCI6WyJyZWFkIiwgImNvbnZlcnQiXX0=&signature=e938c40c0ce190280674bba4e332d55684d62df784158db7aacf4de64fbfaf25'
    },
    {
      id: '1926773785453658751',
      displayName: 'america usa',
      avatar: 'https://cdn.filestackcontent.com/ZYb1sFneTEiFsCapvOe0?policy=eyJoYW5kbGUiOiJaWWIxc0ZuZVRFaUZzQ2Fwdk9lMCIsImV4cGlyeSI6NDYzNTkxODcwNCwiY2FsbCI6WyJyZWFkIiwgImNvbnZlcnQiXX0=&signature=abc6151773584da33b396a78d9913996dfae315d45b41eb09fbbb7fcf6d108a2'
    },
    {
      id: '1720274300943991500',
      displayName: 'Natasha Dwell',
      avatar: 'https://cdn.filepicker.io/api/file/qPjWGBLkSRC7hWd9yfkh?signature=5ff91525a0835a205ed379dddda5d9f18a0e30080b5ac829f2f40f071a6a42eb&policy=eyJoYW5kbGUiOiJxUGpXR0JMa1NSQzdoV2Q5eWZraCIsImV4cGlyeSI6NDYzNTkxODcwNH0='
    },
  ];

  avatarSize = AvatarSize;
  filteredOptions: Observable<any[]>;
  selectedAvatarUrl: string = null;
  selectedOption: any = null;
  myControl: FormControl = new FormControl();
  optionsHeight: number;

  constructor() {
    super();
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith<string | any>(''),
        tap(value => {
          if (typeof value !== 'string') {
            this.selectedAvatarUrl = this.value.avatar;
            console.log('this.value.avatar', this.value.avatar);
            this.notify(value);
          } else {
            this.selectedAvatarUrl = null;
            this.notify(null);
          }
        }),
        map(value => typeof value === 'string' ? value : value.displayName),
        map(displayName => displayName ? this._filter(displayName) : this.options.slice())
      );

    this.filteredOptions.subscribe(a => {
      console.log('a', a);
      this.optionsHeight = a.length * 48;
    });
  }

  displayFn(option): string | null {
    return option ? option.displayName : null;
  }

  onOptionsSelected($event: MatAutocompleteSelectedEvent) {
    this.selectedOption = $event.option.value;
    this.selectedAvatarUrl = this.selectedOption.avatar;
  }

  private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();
    console.log('filterValue', filterValue);
    return filterValue === ''
      ? []
      : this.options.filter(option =>
        option.displayName.toLowerCase().includes(filterValue)
      );
  }

  private notify(value: any): void {
    console.log('notify select', value);
  }
}
