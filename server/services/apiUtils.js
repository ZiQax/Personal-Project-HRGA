const handleRequest = async (res, action, succesStatus = 200) => {
  try {
    const data = await action()

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return res.status(404).json({
        success: false,
        message: 'Data Not Found'
      })
    }

    return res.status(succesStatus).json({
      success: true,
      message: 'Success',
      data
    })
  } catch (err) {
    console.error('API Error:', err)
    return res.status(500).json({
      success: false,
      message: 'Database Error',
      error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    })
  }
}

module.exports = { handleRequest }
