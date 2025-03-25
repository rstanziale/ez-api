@doc("""
  Object state present in all the responses.
  If state.code < 0 then description will fill with the error message.
  """)
model ResponseState {
  code: 0 | -1;
  description?: string;
}
