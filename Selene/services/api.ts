import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://SEU-IP:3000'
})