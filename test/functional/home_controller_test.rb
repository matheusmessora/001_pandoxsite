require 'test_helper'

class HomeControllerTest < ActionController::TestCase
  test "should get contato" do
    get :contato
    assert_response :success
  end

end
