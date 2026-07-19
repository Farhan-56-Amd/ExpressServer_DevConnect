

const validateUserData = (req) => {
  const data = req.body

  const allowedUserData = ['firstName','lastName','photoUrl','about','skills']

  const isvalidRequest = Object.keys(data).every(fields => {
    return allowedUserData.includes(fields)
  })

  return isvalidRequest
}

module.exports = {validateUserData}